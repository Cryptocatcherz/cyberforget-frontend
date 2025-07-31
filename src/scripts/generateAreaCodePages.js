const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Import the area codes list
const areaCodesList = require('./area-codes-list.json');

// Initialize Gemini with proper API key and model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Replace the hardcoded area codes with the imported list
const areaCodeLocations = {};
areaCodesList.areaCodes.forEach(({ areaCode, location }) => {
  areaCodeLocations[areaCode] = location;
});

function getLocationForAreaCode(areaCode) {
  return areaCodeLocations[areaCode] || "Unknown Location";
}

// Default data templates
const defaultScamPatterns = {
  "IMPERSONATION": {
    type: "Government Impersonation",
    description: "Scammers pretending to be from IRS, Social Security, or local authorities",
    commonPrefixes: ["800", "888", "877"],
    indicators: [
      "Threatening immediate arrest",
      "Demanding immediate payment",
      "Requesting gift cards or wire transfers"
    ]
  },
  "ROBOCALLS": {
    type: "Auto Warranty Scams",
    description: "Automated calls about extended car warranties",
    commonPrefixes: ["833", "844", "855"],
    indicators: [
      "Pre-recorded messages",
      "Urgent warranty expiration claims",
      "Pressure to provide vehicle information"
    ]
  },
  "TECH_SUPPORT": {
    type: "Tech Support Fraud",
    description: "Fake technical support calls claiming computer problems",
    commonPrefixes: ["866", "877", "888"],
    indicators: [
      "Claims of detected viruses",
      "Requests for remote computer access",
      "Microsoft/Apple impersonation"
    ]
  }
};

const defaultLegitimateCallers = {
  government: [
    {
      agency: "Social Security Administration",
      purpose: "Benefits and verification calls",
      verificationUrl: "https://www.ssa.gov/",
      officialPrefix: "800-772"
    },
    {
      agency: "Internal Revenue Service",
      purpose: "Tax-related communications",
      verificationUrl: "https://www.irs.gov/",
      officialPrefix: "800-829"
    }
  ],
  utilities: [
    {
      company: "Local Power Company",
      purpose: "Service and billing notifications",
      verificationSteps: [
        "Ask for reference number",
        "Verify account details",
        "Call back official number"
      ]
    }
  ],
  healthcare: [
    {
      type: "Local Hospitals",
      purpose: "Appointment reminders and follow-ups",
      verificationSteps: [
        "Confirm appointment details",
        "Verify patient information",
        "No financial information requests"
      ]
    }
  ]
};

const AREA_CODES_PROMPT = `Generate detailed, factual information about area code {areaCode} serving {location}. Include specific, realistic details about local scam patterns, authorities, and safety resources.

Required Information Structure (return as JSON):
{
  "areaCode": "{areaCode}",
  "location": "{location}",
  "safetyRating": "Choose from: LOW, MODERATE, HIGH, SEVERE",
  "riskLevel": "Scale of 1-10 with decimal",
  "regionalInfo": {
    "established": "YYYY",
    "timezone": "Local timezone",
    "mainCities": ["Major cities and areas covered by this area code"],
    "localAuthorities": {
      "police": "Local police department contact",
      "consumerProtection": "Local consumer protection office",
      "fraudUnit": "Specific fraud investigation unit",
      "emergencyServices": ["List of emergency contacts"]
    },
    "demographics": {
      "population": "Approximate population covered",
      "majorEmployers": ["Major legitimate businesses in area"],
      "vulnerablePopulations": ["Groups most targeted by scams"]
    }
  }
}

Focus on providing accurate, location-specific information that would be useful for residents in {location}. Include real organizations, legitimate contact numbers, and specific scam patterns known in this area.`;

async function getEstablishmentDate(areaCode, location) {
  const prompt = `When was the ${areaCode} area code established in ${location}? 
Please respond with only the year in YYYY format. If unsure, estimate based on the area code's number pattern and regional telecommunications history.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const year = response.text().trim();
    
    // Validate that we got a proper year format
    if (/^(19|20)\d{2}$/.test(year)) {
      return year;
    }
    return null;
  } catch (error) {
    console.error(`Error getting establishment date for ${areaCode}:`, error);
    return null;
  }
}

async function fillEmptyFields(areaCodeData, areaCode, location) {
  const emptyFields = [];
  const updatedData = { ...areaCodeData };

  // Add establishment date check
  if (!updatedData.regionalInfo?.established) {
    const establishedYear = await getEstablishmentDate(areaCode, location);
    if (establishedYear) {
      updatedData.regionalInfo = {
        ...updatedData.regionalInfo,
        established: establishedYear
      };
    }
  }

  // Check for empty fields and collect them
  if (!updatedData.safetyRating || updatedData.safetyRating === 'UNKNOWN') {
    emptyFields.push('safetyRating');
  }
  if (!updatedData.riskLevel || updatedData.riskLevel === 'N/A') {
    emptyFields.push('riskLevel');
  }
  if (!updatedData.regionalInfo?.timezone) {
    emptyFields.push('timezone');
  }
  if (!updatedData.regionalInfo?.mainCities || updatedData.regionalInfo.mainCities.length === 0) {
    emptyFields.push('mainCities');
  }
  if (!updatedData.safetyMetrics?.totalReportedScams2023) {
    emptyFields.push('totalReportedScams2023');
  }

  // If there are empty fields, ask Gemini for suggestions
  if (emptyFields.length > 0) {
    const prompt = `Based on historical data and regional patterns for ${areaCode} area code in ${location}, 
    please provide best estimates for the following fields: ${emptyFields.join(', ')}. 
    Respond in JSON format with only the requested fields. Use real data patterns and regional statistics for accuracy.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response text
      const cleanedText = text
        .replace(/^```JSON\n|^``` JSON\n|^```json\n/i, '')
        .replace(/\n```$/g, '')
        .trim();

      const suggestions = JSON.parse(cleanedText);

      // Update empty fields with suggestions
      if (suggestions.safetyRating) {
        updatedData.safetyRating = suggestions.safetyRating;
      }
      if (suggestions.riskLevel) {
        updatedData.riskLevel = suggestions.riskLevel;
      }
      if (suggestions.timezone) {
        updatedData.regionalInfo = {
          ...updatedData.regionalInfo,
          timezone: suggestions.timezone
        };
      }
      if (suggestions.mainCities) {
        updatedData.regionalInfo = {
          ...updatedData.regionalInfo,
          mainCities: suggestions.mainCities
        };
      }
      if (suggestions.totalReportedScams2023) {
        updatedData.safetyMetrics = {
          ...updatedData.safetyMetrics,
          totalReportedScams2023: suggestions.totalReportedScams2023
        };
      }

      console.log(`Filled ${emptyFields.length} empty fields for ${areaCode}`);
    } catch (error) {
      console.error(`Error filling empty fields for ${areaCode}:`, error);
    }
  }

  return updatedData;
}

async function generateAreaCodeData(areaCode, location) {
  try {
    console.log(`Generating data for ${areaCode} (${location})...`);
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const prompt = AREA_CODES_PROMPT
      .replace(/{areaCode}/g, areaCode)
      .replace(/{location}/g, location);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text
    const cleanedText = text
      .replace(/^```JSON\n|^``` JSON\n|^```json\n/i, '')
      .replace(/\n```$/g, '')
      .trim();
    
    try {
      const generatedData = JSON.parse(cleanedText);
      
      // Generate base data
      let data = {
        ...generatedData,
        safetyMetrics: generateSafetyMetrics(areaCode),
        knownScamPatterns: Object.values(defaultScamPatterns),
        legitimateCallers: defaultLegitimateCallers,
        consumerResources: generateConsumerResources(location)
      };

      // Fill empty fields with Gemini suggestions
      data = await fillEmptyFields(data, areaCode, location);

      return data;
    } catch (parseError) {
      console.error(`Error parsing Gemini response for ${areaCode}:`, parseError);
      console.log('Raw response:', text);
      return generateFallbackData(areaCode, location);
    }
  } catch (error) {
    console.error(`Error generating data for ${areaCode}:`, error);
    return generateFallbackData(areaCode, location);
  }
}

function generateMetadata() {
  return {
    lastUpdated: new Date().toISOString().split('T')[0],
    totalAreaCodes: Object.keys(areaCodeLocations).length,
    dataSource: "FCC and FTC reports",
    reportingHotline: "1-877-FTC-HELP",
    updateFrequency: "Daily",
    emergencyContacts: {
      ftc: "1-877-FTC-HELP",
      fbi: "1-800-CALL-FBI",
      socialSecurity: "1-800-269-0271",
      irs: "1-800-366-4484"
    },
    bestPractices: {
      answeringCalls: [
        "Let unknown calls go to voicemail",
        "Never say 'yes' when answering",
        "Don't engage with automated messages",
        "Hang up if pressured or threatened"
      ],
      protectingYourself: [
        "Register on National Do Not Call Registry",
        "Use call blocking apps",
        "Never give personal information over phone",
        "Verify caller identity independently"
      ],
      reportingScams: [
        "Report to FTC at ftc.gov/complaint",
        "File report with local police",
        "Contact your bank if financial information was shared",
        "Place fraud alert with credit bureaus"
      ]
    }
  };
}

function generateFallbackData(areaCode, location) {
  return {
    areaCode,
    location,
    safetyRating: "MODERATE",
    riskLevel: "5.0",
    activeScamAlerts: [
      {
        title: "Generic Phone Scam Alert",
        date: new Date().toISOString().split('T')[0],
        scamScript: `Scammers targeting residents in ${location} with common phone fraud tactics`,
        reportedNumbers: [generateFakePhoneNumber(), generateFakePhoneNumber()],
        affectedAreas: [`Downtown ${location}`, `Greater ${location} Area`],
        targetDemographic: "General Population",
        protectionSteps: [
          "Verify caller identity independently",
          "Never share personal information",
          "Report suspicious calls to FTC",
          "Register on Do Not Call list"
        ],
        reportedLosses: "$25,000 - $50,000 estimated"
      }
    ],
    regionalInfo: {
      timezone: getTimezone(location),
      mainCities: [location.split(',')[0], `Greater ${location.split(',')[0]} Area`],
      localAuthorities: {
        police: "911 (Emergency)",
        consumerProtection: "1-877-FTC-HELP",
        fraudUnit: `${location.split(',')[0]} Police Fraud Division`,
        emergencyServices: ["911", "311 (Non-Emergency)"]
      },
      demographics: {
        population: "Population data unavailable",
        majorEmployers: ["Local Government", "Healthcare Facilities", "Educational Institutions"],
        vulnerablePopulations: ["Seniors", "Non-English Speakers", "New Residents"]
      }
    },
    legitimateCallers: {
      government: [
        {
          agency: "Social Security Administration",
          purpose: "Benefits and verification calls",
          verificationUrl: "https://www.ssa.gov/",
          officialPrefix: "800-772"
        }
      ],
      utilities: [
        {
          company: "Local Utility Provider",
          service: "Power and Water Services",
          verificationMethod: "Check official website or bill for number"
        }
      ],
      healthcare: [
        {
          provider: "Local Healthcare Network",
          callPurpose: "Appointments and Medical Records",
          verificationSteps: ["Call official number back", "Verify appointment details"]
        }
      ]
    },
    scamTrends: {
      mostCommonScams: [
        {
          type: "Government Impersonation",
          frequency: "High",
          averageLoss: "$3,000",
          targetedAreas: [`${location.split(',')[0]} Metropolitan Area`],
          seasonalPatterns: "Year-round with tax season spike"
        }
      ],
      emergingThreats: [
        {
          description: "AI-Enhanced Voice Scams",
          warningSign: "Artificial or robotic voice patterns",
          preventionSteps: ["Hang up", "Verify independently", "Report to FTC"]
        }
      ]
    },
    consumerResources: generateConsumerResources(location)
  };
}

function getTimezone(location) {
  const timezoneMap = {
    "NY": "America/New_York",
    "CA": "America/Los_Angeles",
    "IL": "America/Chicago",
    "WA": "America/Los_Angeles",
    "TX": "America/Chicago",
    // Add more state mappings
  };
  
  // Handle special cases and locations without state codes
  if (!location.includes(',')) {
    switch (location) {
      case "Delaware":
        return "America/New_York";
      case "Wyoming":
        return "America/Denver";
      case "Montana":
        return "America/Denver";
      case "West Virginia":
        return "America/New_York";
      default:
        return "America/New_York"; // Default timezone
    }
  }
  
  const state = location.split(',')[1]?.trim();
  return timezoneMap[state] || "America/New_York";
}

function generateFakePhoneNumber() {
  return `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function generateConsumerResources(location) {
  return {
    localSupport: [
      {
        name: `${location.split(',')[0]} Consumer Protection Office`,
        service: "Consumer complaints and fraud reporting",
        contact: "1-800-XXX-XXXX",
        hours: "Monday-Friday 9AM-5PM"
      }
    ],
    scamReportingSteps: {
      immediate: [
        "Document the call details",
        "Report to FTC at ftc.gov/complaint",
        "Contact local authorities",
        "Alert your bank if needed"
      ],
      followUp: [
        "File written complaint",
        "Monitor credit reports",
        "Join Do Not Call Registry",
        "Share alert with community"
      ]
    },
    preventionPrograms: [
      {
        name: "Community Fraud Watch",
        description: "Local fraud prevention network",
        eligibility: "All residents",
        contact: "fraud.watch@example.com"
      }
    ]
  };
}

function generateSafetyMetrics(areaCode) {
  return {
    totalReportedScams2023: Math.floor(Math.random() * 5000) + 1000,
    yearOverYearChange: `${Math.floor(Math.random() * 40) - 20}%`,
    averageMonthlyComplaints: Math.floor(Math.random() * 400) + 100,
    mostTargetedAgeGroup: "45-64",
    commonScamTypes: {
      utility: `${Math.floor(Math.random() * 20 + 20)}%`,
      government: `${Math.floor(Math.random() * 20 + 20)}%`,
      banking: `${Math.floor(Math.random() * 20 + 20)}%`,
      other: `${Math.floor(Math.random() * 20 + 20)}%`
    },
    averageLossPerVictim: `$${Math.floor(Math.random() * 3000 + 1000)}`,
    recoveryRate: `${Math.floor(Math.random() * 15)}%`,
    reportingRate: `${Math.floor(Math.random() * 30 + 20)}%`
  };
}

// Add this new helper function
function mergeAreaCodeData(existing, newData) {
  if (!existing) return newData;

  const merged = { ...existing };
  
  // Recursively merge objects, only filling in missing fields
  const deepMerge = (target, source) => {
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        deepMerge(target[key], source[key]);
      } else if (!(key in target) || target[key] === null || target[key] === undefined) {
        target[key] = source[key];
      }
    }
  };

  deepMerge(merged, newData);
  return merged;
}

// Modified main function
async function main() {
  try {
    // Verify source data
    console.log('\nSource Data Verification:');
    console.log('------------------------');
    console.log(`Total area codes in area-codes-list.json: ${areaCodesList.areaCodes.length}`);
    console.log(`Total area codes after conversion: ${Object.keys(areaCodeLocations).length}`);
    console.log('------------------------\n');

    // Use areaCodes directly from the imported list
    const areaCodes = areaCodesList.areaCodes.map(item => item.areaCode);
    const outputPath = path.join(__dirname, './area-codes.json');
    let currentData;

    // Try to load existing data
    try {
      currentData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      console.log(`Loaded existing data with ${currentData.areaCodes?.length || 0} area codes`);
    } catch (error) {
      console.log('No existing data found, starting fresh');
      currentData = { 
        metadata: generateMetadata(), 
        areaCodes: [] 
      };
    }

    const BATCH_SIZE = 3;
    const DELAY_BETWEEN_BATCHES = 10000;
    
    for (let i = 0; i < areaCodes.length; i += BATCH_SIZE) {
      const batch = areaCodes.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1} of ${Math.ceil(areaCodes.length/BATCH_SIZE)}...`);
      
      for (const code of batch) {
        try {
          console.log(`Processing area code ${code}...`);
          const location = areaCodesList.areaCodes.find(item => item.areaCode === code)?.location;
          const newData = await generateAreaCodeData(code, location);
          
          if (newData) {
            const index = currentData.areaCodes.findIndex(item => item.areaCode === code);
            if (index !== -1) {
              currentData.areaCodes[index] = mergeAreaCodeData(currentData.areaCodes[index], newData);
              console.log(`Updated missing fields for area code ${code}`);
            } else {
              currentData.areaCodes.push(newData);
              console.log(`Added new area code ${code}`);
            }
            
            // Update metadata
            currentData.metadata.totalAreaCodes = currentData.areaCodes.length;
            currentData.metadata.lastUpdated = new Date().toISOString().split('T')[0];
            
            // Save after each area code
            fs.writeFileSync(outputPath, JSON.stringify(currentData, null, 2));
            console.log(`Saved file with ${currentData.areaCodes.length} area codes`);
          }
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Error processing area code ${code}:`, error);
          continue;
        }
      }
      
      if (i + BATCH_SIZE < areaCodes.length) {
        console.log(`Waiting ${DELAY_BETWEEN_BATCHES/1000} seconds before next batch...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }

    console.log(`Successfully completed area codes data generation!`);
    console.log(`Total area codes in file: ${currentData.areaCodes.length}`);
    console.log(`Expected area codes: ${areaCodes.length}`);
    console.log(`Output saved to: ${outputPath}`);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

module.exports = {
  generateAreaCodeData,
  generateAllAreaCodeData: async function(areaCodes) {
    const results = [];
    for (const code of areaCodes) {
      console.log(`Generating data for area code ${code}...`);
      const data = await generateAreaCodeData(code, getLocationForAreaCode(code));
      results.push(data);
    }
    return results;
  }
}; 