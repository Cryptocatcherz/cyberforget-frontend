# Data Broker Scanner Integration with PeopleSites

## Overview
Your ChatPage now integrates with your localhost PeopleSites for realistic data broker scanning. When users click the first premade question "Analyze my digital footprint and security posture" and then press the 🔍 Data Broker Scanner tool, it will scan through all your localhost sites.

## How It Works

### 1. **Premade Question Integration**
- **First question**: "Analyze my digital footprint and security posture" 
- **Tool Type**: `data_broker_scan`
- **Triggers**: DataBrokerScanTool component

### 2. **Localhost Site Scanning**
The scanner now includes your 10 localhost sites:
- **PeopleTrace**: http://localhost:4001
- **FindFolk**: http://localhost:4002  
- **Locate**: http://localhost:4003
- **PremiumDirectory**: http://localhost:4004
- **CyberTrace**: http://localhost:4005
- **SearchMate**: http://localhost:4006
- **PeopleConnect**: http://localhost:4007
- **FindPerson**: http://localhost:4008
- **EliteTracker**: http://localhost:4009
- **SearchBot**: http://localhost:4010

### 3. **Enhanced Scanning Logic**
- **Localhost sites**: 85% match rate (for demo purposes)
- **External sites**: 4-8% match rate (realistic)
- **Scan duration**: 60 seconds total
- **Sites scanned**: 50+ (10 localhost + 40+ external)

## Setup Instructions

### 1. **Start Your PeopleSites**
```bash
cd /Users/luke/Desktop/CyberForget/PeopleSites/people-search-generator
chmod +x start-all-sites.sh
./start-all-sites.sh
```

This will start all 10 sites on ports 4001-4010.

### 2. **Start Your Frontend**
```bash
cd /Users/luke/Desktop/CyberForget/frontendv2
npm start
```

### 3. **Test the Integration**
1. Go to your ChatPage (should be your index)
2. Click the first premade question: "Analyze my digital footprint and security posture"
3. Click the 🔍 "Data Broker Scanner" tool that appears
4. Enter a first and last name
5. Click "SCAN 50+ SITES NOW"
6. Watch as it scans through your localhost sites in the popup window

## What You'll See

### During Scanning:
- Real-time progress bar
- Current site being scanned
- Screenshots of each site (via thum.io)
- Live threat alerts as matches are found
- Metrics showing sites scanned vs exposures found

### After Scanning:
- Detailed results showing which sites found data
- Threat analysis by category
- Risk level assessment
- Option to sign up for "full scan"

## Technical Details

### Modified Files:
- `DataBrokerScanTool.js`: Updated to include localhost sites
- `chatConstants.js`: First question triggers data broker scan
- `InlineToolRenderer.js`: Handles the tool display

### Key Features:
- **Realistic Demo**: Localhost sites have high match rates for demonstration
- **Mixed Results**: Combines localhost and external sites for realism  
- **Screenshots**: Uses thum.io to capture site screenshots during scanning
- **Progress Tracking**: Real-time updates during 60-second scan
- **Threat Analysis**: Categorizes findings by type of data broker

## Troubleshooting

### If localhost sites aren't starting:
```bash
# Check what's running on ports
lsof -i :4001-4010

# Kill processes if needed
./stop-all-sites.sh
./start-all-sites.sh
```

### If scanning doesn't show localhost sites:
- Ensure all 10 sites are running on ports 4001-4010
- Check browser console for any connection errors
- Verify the URLs in DataBrokerScanTool.js are correct

## Customization

### To add more localhost sites:
1. Add them to the `dataBrokerSites` array in `DataBrokerScanTool.js`
2. Set `localhost: true` and appropriate category
3. Use format: `http://localhost:PORT?search=${firstName}+${lastName}`

### To adjust match rates:
- Modify `matchChance` values in the scanning logic
- Localhost sites: Currently 85% (line 140)
- External sites: Currently 4-8% (lines 142-147)

## Demo Flow
1. User visits ChatPage
2. Clicks "Analyze my digital footprint and security posture"
3. Sees Data Broker Scanner tool appear in chat
4. Enters name and clicks scan
5. Watches real-time scan of 50+ sites including all localhost sites
6. Sees realistic results with most localhost sites showing "matches"
7. Gets threat analysis and signup prompt

Perfect for demonstrating your full security ecosystem!