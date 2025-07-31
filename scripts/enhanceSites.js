require('dotenv').config();
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const BATCH_SIZE = 5; // Process 5 sites at a time to avoid rate limits
const DELAY_BETWEEN_BATCHES = 5000; // 5 seconds delay between batches

async function enhanceSite(site) {
  const prompt = `
    Given this basic website information:
    ${JSON.stringify(site, null, 2)}

    Please enhance it with additional accurate information in this format:
    {
      // Keep existing fields
      "name": "${site.name}",
      "url": "${site.url}",
      "difficulty": "${site.difficulty}",
      "domains": ${JSON.stringify(site.domains)},
      
      // Add new fields
      "email": "support email if available",
      "category": "main category of the service",
      "tags": ["relevant", "keywords", "for", "service"],
      "monthly_users": "approximate number if available",
      "founded_year": year,
      "headquarters": "location",
      "deletion_type": "self-service/contact-required/automated",
      "account_recovery_period": "time period",
      "data_retention_period": "time period",
      "alternatives": ["3-5", "similar", "services"],
      "required_for_deletion": ["items", "needed"],
      "deletion_impact": [
        "consequences",
        "of deletion"
      ],
      "steps": {
        "en": [
          "step 1",
          "step 2",
          "etc"
        ],
        "es": [
          "paso 1",
          "paso 2",
          "etc"
        ]
      },
      "meta_description": {
        "en": "SEO description",
        "es": "Spanish SEO description"
      },
      "faqs": [
        {
          "question": "Common question",
          "answer": "Answer"
        }
      ],
      "last_verified": "2024-03-20",
      "status": "active",
      "gdpr_compliant": true/false,
      "ccpa_compliant": true/false,
      "social_media": {
        "twitter": "@handle",
        "facebook": "pagename"
      }
    }

    Please ensure all information is accurate and based on publicly available data.
    If certain information is not available, use reasonable defaults or omit the field.
    IMPORTANT: Respond ONLY with the JSON object, no additional text.
  `;

  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    // Sometimes Gemini includes markdown code blocks, so we need to handle that
    const jsonMatch = text.match(/```json\n?(.*)\n?```/s) || text.match(/\{.*\}/s);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;

    try {
      const enhancedSite = JSON.parse(jsonString.trim());
      return enhancedSite;
    } catch (parseError) {
      console.error(`Error parsing JSON for ${site.name}:`, parseError);
      return site;
    }
  } catch (error) {
    console.error(`Error enhancing ${site.name}:`, error);
    return site; // Return original site if enhancement fails
  }
}

async function processSites() {
  // Read existing sites
  const sites = JSON.parse(fs.readFileSync('src/sites.json', 'utf8'));
  const enhancedSites = [];
  let successCount = 0;
  let failCount = 0;
  
  // Process sites in batches
  for (let i = 0; i < sites.length; i += BATCH_SIZE) {
    const batch = sites.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1} of ${Math.ceil(sites.length/BATCH_SIZE)}`);
    
    for (const site of batch) {
      try {
        const enhancedSite = await enhanceSite(site);
        if (Object.keys(enhancedSite).length > Object.keys(site).length) {
          successCount++;
          console.log(`✅ Successfully enhanced: ${site.name}`);
        } else {
          failCount++;
          console.log(`⚠️ No enhancements for: ${site.name}`);
        }
        enhancedSites.push(enhancedSite);
        
        // Save progress after each site
        fs.writeFileSync(
          'src/sites-enhanced.json', 
          JSON.stringify(enhancedSites, null, 2)
        );
        
        // Small delay between individual sites
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to process ${site.name}:`, error);
        failCount++;
        enhancedSites.push(site);
      }
    }
    
    // Wait before processing next batch
    if (i + BATCH_SIZE < sites.length) {
      console.log(`Waiting ${DELAY_BETWEEN_BATCHES/1000} seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }
  
  console.log('\nEnhancement complete!');
  console.log(`Successfully enhanced: ${successCount} sites`);
  console.log(`Failed/Skipped: ${failCount} sites`);
  console.log('Check sites-enhanced.json for results');
}

// Install required package
try {
  require('@google/generative-ai');
} catch (e) {
  console.error('\nPlease install the required package first:');
  console.error('npm install @google/generative-ai\n');
  process.exit(1);
}

processSites().catch(console.error);