// Node.js script to check frontend environment mode
const path = require('path');

// Read environment files
const fs = require('fs');

function loadEnvFile(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const lines = content.split('\n');
    const env = {};
    
    lines.forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        env[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return env;
  } catch (error) {
    return {};
  }
}

// Check which environment file is being used
const envPath = path.join(__dirname, '.env');
const envLocalPath = path.join(__dirname, '.env.local');
const envProdPath = path.join(__dirname, '.env.production');

let currentEnv = {};
let activeFile = 'default';

if (fs.existsSync(envPath)) {
  currentEnv = loadEnvFile(envPath);
  activeFile = '.env';
} else if (fs.existsSync(envLocalPath)) {
  currentEnv = loadEnvFile(envLocalPath);
  activeFile = '.env.local (fallback)';
}

const isProduction = currentEnv.REACT_APP_PRODUCTION_MODE === 'true' || currentEnv.NODE_ENV === 'production';
const apiUrl = currentEnv.REACT_APP_API_BASE_URL || currentEnv.REACT_APP_API_URL || 'http://localhost:3001';
const isNetlify = apiUrl.includes('herokuapp.com');

const mode = isProduction ? 'PRODUCTION' : 'DEVELOPMENT';
const platform = isNetlify ? 'Netlify → Heroku' : 'Local → Local';

console.log(`🌍 Frontend Environment: ${mode} (${platform})`);
console.log(`📁 Active config: ${activeFile}`);
console.log(`🔗 API URL: ${apiUrl}`);
console.log(`🎛️ Debug Features: ${isProduction ? 'DISABLED' : 'ENABLED'}`);
console.log(`⚡ Auto-scan: ${currentEnv.REACT_APP_AUTO_SCAN_ENABLED !== 'false' ? 'ENABLED' : 'DISABLED'}`);

module.exports = { isProduction, apiUrl, platform, mode };