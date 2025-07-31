import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, GEMINI_API_URL } from './config/constants';

// Rate limiting constants
const MIN_TIME_BETWEEN_CALLS = 3000; // 3 seconds
let lastApiCall = 0;
let quotaExceeded = false;

// Fallback scoring function
const calculateFallbackScore = (firstName, lastName, city, country) => {
    return {
        score: 3,
        matches: 8,
        threatLevel: 'Moderate',
        analysis: 'Standard privacy risk assessment',
        recommendedActions: ['Verify your information for more accurate results'],
        categoryDistribution: {
            peopleSearch: 3,
            backgroundCheck: 1,
            addressHistory: 1,
            publicRecords: 1,
            socialMedia: 1,
            dataBrokers: 1
        }
    };
};

// Initialize Gemini
const initializeGemini = () => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error('Gemini API key is missing');
        return null;
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-pro" });
};

export const fetchMatchProbability = async (firstName, lastName, city, country) => {
    if (!GEMINI_API_KEY) {
        console.error('Gemini API key is missing. Please check your environment variables.');
        return calculateFallbackScore(firstName, lastName, city, country);
    }

    // Add a function to detect obviously fake names
    const isObviouslyFakeName = (name) => {
        const repeatingPattern = /(.)\1{2,}/;
        const keyboardPattern = /(qwerty|asdfgh|zxcvbn)/i;
        const nonNamePattern = /[^a-zA-Z\-\s']/;
        const consonantPattern = /[bcdfghjklmnpqrstvwxz]{4,}/i;

        return repeatingPattern.test(name) ||
               keyboardPattern.test(name) ||
               nonNamePattern.test(name) ||
               consonantPattern.test(name);
    };

    // Check if either name part is obviously fake
    if (isObviouslyFakeName(firstName) || isObviouslyFakeName(lastName)) {
        return {
            score: 1,
            matches: 1,
            threatLevel: 'Low',
            analysis: 'This appears to be randomly generated or non-standard input',
            recommendedActions: ['Verify your information for more accurate results'],
            categoryDistribution: {
                peopleSearch: 1,
                backgroundCheck: 0,
                addressHistory: 0,
                publicRecords: 0,
                socialMedia: 0,
                dataBrokers: 0
            }
        };
    }

    try {
        const prompt = `Analyze this name and location for data privacy risks:
            Name: ${firstName} ${lastName}
            Location: ${city}, ${country}

            Respond with a JSON object only, using this exact format:
            {
                "score": 4,
                "matches": 15,
                "threatLevel": "High",
                "analysis": "Brief analysis here",
                "recommendedActions": ["Action 1", "Action 2"],
                "estimatedThreats": {
                    "peopleSearch": 5,
                    "backgroundCheck": 2,
                    "addressHistory": 3,
                    "publicRecords": 2,
                    "socialMedia": 2,
                    "dataBrokers": 1
                }
            }

            Rules:
            - For common names (e.g., "James Smith"): score 4-5, matches 15-25
            - For less common names (e.g., "Luke Davies"): score 3-4, matches 8-15
            - For rare names: score 2-3, matches 3-8`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });

            if (response.status === 404) {
                console.error('Model not found. Please check the API endpoint URL.');
            }
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('Invalid response format from Gemini API');
        }

        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }
            const analysis = JSON.parse(jsonMatch[0]);

            // Ensure we have valid values with defaults
            return {
                score: analysis.score || 3,
                matches: analysis.matches || 8,
                threatLevel: analysis.threatLevel || 'Moderate',
                analysis: analysis.analysis || 'Analysis of potential data exposure',
                recommendedActions: analysis.recommendedActions || ['Verify your information'],
                categoryDistribution: analysis.estimatedThreats || {
                    peopleSearch: 3,
                    backgroundCheck: 1,
                    addressHistory: 1,
                    publicRecords: 1,
                    socialMedia: 1,
                    dataBrokers: 1
                }
            };

        } catch (parseError) {
            console.error('Failed to parse Gemini response:', parseError);
            return calculateFallbackScore(firstName, lastName, city, country);
        }

    } catch (error) {
        console.error('Gemini API Error:', error);
        return calculateFallbackScore(firstName, lastName, city, country);
    }
};
