// Preview Generator for Local PeopleSites
// Generates realistic preview images for localhost sites to simulate scanning

export const generatePeopleSitePreview = (siteName, firstName, lastName, city, recordCount = 1) => {
  // Create a canvas element for generating the preview
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions to fit scanning display (optimized for 180px height display)
  canvas.width = 320;
  canvas.height = 180;
  
  // Add subtle shadow effect for professional browser-like appearance
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  
  // Define site-specific styling - completely unique for each site
  const siteStyles = {
    'PeopleTrace': {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      bgColor: '#f8fafc',
      emoji: '🏢',
      tagline: 'Executive Business Directory',
      headerHeight: 70,
      layout: 'corporate',
      font: 'Arial'
    },
    'FindFolk': {
      primaryColor: '#7c3aed',
      secondaryColor: '#a855f7',
      bgColor: '#f3f4f6',
      emoji: '👥',
      tagline: 'Social Network Search',
      headerHeight: 50,
      layout: 'social',
      font: 'Arial'
    },
    'Locate': {
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      bgColor: '#ecfdf5',
      emoji: '📍',
      tagline: 'Location Intelligence',
      headerHeight: 80,
      layout: 'map',
      font: 'Arial'
    },
    'PremiumDirectory': {
      primaryColor: '#dc2626',
      secondaryColor: '#ef4444',
      bgColor: '#fefefe',
      emoji: '⭐',
      tagline: 'Premium Professional Network',
      headerHeight: 90,
      layout: 'premium',
      font: 'Arial'
    },
    'CyberTrace': {
      primaryColor: '#000000',
      secondaryColor: '#059669',
      bgColor: '#0a0a0a',
      emoji: '💻',
      tagline: '> TERMINAL ACCESS',
      headerHeight: 40,
      layout: 'terminal',
      font: 'Courier New'
    },
    'SearchMate': {
      primaryColor: '#0891b2',
      secondaryColor: '#06b6d4',
      bgColor: '#f0f9ff',
      emoji: '📱',
      tagline: 'Mobile Search App',
      headerHeight: 60,
      layout: 'mobile',
      font: 'Arial'
    },
    'PeopleConnect': {
      primaryColor: '#be185d',
      secondaryColor: '#ec4899',
      bgColor: '#fdf2f8',
      emoji: '🌐',
      tagline: 'Social Intelligence Platform',
      headerHeight: 55,
      layout: 'gradient',
      font: 'Arial'
    },
    'FindPerson': {
      primaryColor: '#1f2937',
      secondaryColor: '#374151',
      bgColor: '#111827',
      emoji: '🔍',
      tagline: 'DATABASE SEARCH',
      headerHeight: 45,
      layout: 'database',
      font: 'Courier New'
    },
    'EliteTracker': {
      primaryColor: '#92400e',
      secondaryColor: '#d97706',
      bgColor: '#fffbeb',
      emoji: '⭐',
      tagline: 'CLASSIFIED INTELLIGENCE',
      headerHeight: 85,
      layout: 'luxury',
      font: 'Arial'
    },
    'SearchBot': {
      primaryColor: '#374151',
      secondaryColor: '#6b7280',
      bgColor: '#f9fafb',
      emoji: '🤖',
      tagline: 'AI-Powered Search',
      headerHeight: 65,
      layout: 'ai',
      font: 'Arial'
    }
  };
  
  const style = siteStyles[siteName] || siteStyles['PeopleTrace'];
  
  // Fill background
  ctx.fillStyle = style.bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Enhanced layouts with professional styling - optimized for 320x180
  if (style.layout === 'terminal') {
    // CyberTrace - Professional terminal interface
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Terminal window frame
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(0, 0, canvas.width, 22);
    
    // macOS-style buttons
    ctx.fillStyle = '#ff5f56'; 
    ctx.beginPath(); ctx.arc(12, 11, 4, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = '#ffbd2e'; 
    ctx.beginPath(); ctx.arc(26, 11, 4, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = '#27ca3f'; 
    ctx.beginPath(); ctx.arc(40, 11, 4, 0, 2 * Math.PI); ctx.fill();
    
    // Window title
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CyberTrace Terminal — bash', canvas.width/2, 15);
    ctx.textAlign = 'left';
    
    // Enhanced terminal content with highly visible user info
    ctx.fillStyle = '#00ff41';
    ctx.font = 'bold 10px "SF Mono", Monaco, "Cascadia Code", monospace';
    ctx.fillText('user@cybertrace:~$ ./scan.sh', 8, 40);
    
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 10px "SF Mono", Monaco, "Cascadia Code", monospace';
    ctx.fillText('> SCANNING TARGET...', 8, 55);
    
    // Make user's name HIGHLY VISIBLE
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, 62, canvas.width - 16, 16);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px "SF Mono", Monaco, "Cascadia Code", monospace';
    ctx.fillText('TARGET: ' + firstName.toUpperCase() + ' ' + lastName.toUpperCase(), 12, 74);
    
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 10px "SF Mono", Monaco, "Cascadia Code", monospace';
    ctx.fillText('> Location: ' + (city || 'UNKNOWN'), 8, 88);
    
    // Progress bar with animation effect
    ctx.fillStyle = '#333333';
    ctx.fillRect(8, 100, 200, 8);
    ctx.fillStyle = '#00ff41';
    ctx.fillRect(8, 100, 180, 8);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px "SF Mono", Monaco, monospace';
    ctx.fillText('████████████████████ 100%', 8, 120);
    
    // HIGHLY VISIBLE breach alert
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(8, 130, canvas.width - 16, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px "SF Mono", Monaco, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚠ ' + recordCount + ' RECORDS EXPOSED ⚠', canvas.width/2, 142);
    ctx.textAlign = 'left';
    
    ctx.fillStyle = '#00ff41';
    ctx.fillText('user@cybertrace:~$ █', 8, 155);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    });
    
  } else if (style.layout === 'database') {
    // FindPerson - Professional database interface
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Database header with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 35);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 35);
    
    // Logo and title
    ctx.fillStyle = '#0ea5e9';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('🔍 FindPerson', 8, 22);
    
    ctx.fillStyle = '#64748b';
    ctx.font = '8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('DATABASE v2.1 — Advanced Search', 100, 22);
    
    // Search bar with highly visible user name
    ctx.fillStyle = '#334155';
    ctx.fillRect(8, 40, canvas.width - 16, 22);
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 40, canvas.width - 16, 22);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('🔍 SEARCH: "' + firstName.toUpperCase() + ' ' + lastName.toUpperCase() + '"', 12, 54);
    
    // Results table header
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, 68, canvas.width - 16, 18);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('NAME', 12, 79);
    ctx.fillText('LOCATION', 80, 79);
    ctx.fillText('RECORDS', 160, 79);
    ctx.fillText('STATUS', 220, 79);
    
    // Table row with highly visible results
    if (recordCount > 0) {
      // Highlight the user's record
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(8, 86, canvas.width - 16, 20);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(firstName.toUpperCase() + ' ' + lastName.toUpperCase(), 12, 98);
      ctx.font = 'bold 9px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(city || 'MULTIPLE', 80, 98);
      ctx.fillText(recordCount.toString(), 160, 98);
      
      // Status indicator - very visible
      ctx.fillStyle = '#000000';
      ctx.fillRect(210, 88, 50, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('EXPOSED', 235, 98);
      ctx.textAlign = 'left';
    } else {
      ctx.fillStyle = '#374151';
      ctx.fillRect(8, 86, canvas.width - 16, 20);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('No records found', 12, 98);
    }
    
    // Footer stats
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, 112, canvas.width - 16, 25);
    ctx.fillStyle = '#0ea5e9';
    ctx.font = 'bold 8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('🛡️ Database scanned: 847,293 records', 12, 125);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '7px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Last updated: ' + new Date().toLocaleDateString(), 12, 135);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    });
    
  } else if (style.layout === 'luxury') {
    // EliteTracker - Premium intelligence card
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Outer luxury frame
    const outerGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    outerGradient.addColorStop(0, '#ffd700');
    outerGradient.addColorStop(0.5, '#ffed4e');
    outerGradient.addColorStop(1, '#ffd700');
    ctx.strokeStyle = outerGradient;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    
    // Inner card background
    const cardGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    cardGradient.addColorStop(0, '#2a2a2a');
    cardGradient.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = cardGradient;
    ctx.fillRect(8, 8, canvas.width - 16, canvas.height - 16);
    
    // Header section
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(12, 12, canvas.width - 24, 35);
    
    // Elite logo
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 16px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText('⭐ ELITE ⭐', canvas.width/2, 32);
    
    // Classification banner
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(12, 50, canvas.width - 24, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔒 TOP SECRET CLEARANCE 🔒', canvas.width/2, 62);
    
    // Member information section with enhanced visibility
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 11px "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SUBJECT PROFILE:', 16, 85);
    
    // Highlight the user's name prominently
    ctx.fillStyle = '#000000';
    ctx.fillRect(16, 90, canvas.width - 60, 16);
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 12px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('NAME: ' + firstName.toUpperCase() + ' ' + lastName.toUpperCase(), 20, 102);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('Classification: ALPHA-7', 16, 120);
    ctx.fillText('Intelligence Records: ' + recordCount, 16, 135);
    
    // Enhanced threat level indicator
    ctx.fillStyle = recordCount > 2 ? '#ff0000' : recordCount > 0 ? '#ff8800' : '#00ff00';
    ctx.font = 'bold 11px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('Threat Level: ' + (recordCount > 2 ? 'HIGH' : recordCount > 0 ? 'MEDIUM' : 'LOW'), 16, 150);
    
    // Security stamp
    ctx.save();
    ctx.translate(canvas.width - 60, canvas.height - 40);
    ctx.rotate(-0.3);
    ctx.fillStyle = 'rgba(220, 38, 38, 0.7)';
    ctx.font = 'bold 12px "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CLASSIFIED', 0, 0);
    ctx.restore();
    
    // Corner accents
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(12, 12, 15, 3);
    ctx.fillRect(12, 12, 3, 15);
    ctx.fillRect(canvas.width - 27, 12, 15, 3);
    ctx.fillRect(canvas.width - 15, 12, 3, 15);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    });
    
  } else if (style.layout === 'mobile') {
    // SearchMate - Enhanced mobile app interface
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // iPhone-style notch and status bar
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, 25);
    
    // Notch
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(canvas.width/2 - 30, 0, 60, 8);
    
    // Status indicators
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('9:41', 10, 18);
    ctx.fillText('🔋 100%', canvas.width - 50, 18);
    ctx.fillText('📶', canvas.width - 70, 18);
    
    // App header with gradient
    const headerGradient = ctx.createLinearGradient(0, 25, 0, 65);
    headerGradient.addColorStop(0, '#0891b2');
    headerGradient.addColorStop(1, '#06b6d4');
    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 25, canvas.width, 40);
    
    // Header shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 65, canvas.width, 2);
    
    // App title with icon
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('📱', 12, 50);
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('SearchMate', 35, 50);
    
    // Search count badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(canvas.width - 60, 35, 50, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Live Search', canvas.width - 55, 47);
    
    // Enhanced search bar with shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(12, 75, canvas.width - 24, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 73, canvas.width - 20, 20);
    ctx.strokeStyle = 'rgba(8, 145, 178, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 73, canvas.width - 20, 20);
    
    // Search icon and text
    ctx.fillStyle = '#0891b2';
    ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('🔍', 15, 86);
    ctx.fillStyle = '#666666';
    ctx.font = '9px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(firstName + ' ' + lastName, 30, 86);
    
    // Results card with modern design
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(12, 105, canvas.width - 24, 55);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 103, canvas.width - 20, 55);
    
    // Modern card border
    ctx.strokeStyle = 'rgba(8, 145, 178, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 103, canvas.width - 20, 55);
    
    // Contact avatar
    ctx.fillStyle = '#0891b2';
    ctx.beginPath();
    ctx.arc(25, 118, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👤', 25, 122);
    ctx.textAlign = 'left';
    
    // Contact info with highly visible user name
    ctx.fillStyle = '#0891b2';
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('MATCH FOUND', 40, 113);
    
    // Highlight the user's name prominently
    ctx.fillStyle = '#0891b2';
    ctx.fillRect(40, 118, canvas.width - 90, 14);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(firstName.toUpperCase() + ' ' + lastName.toUpperCase(), 42, 128);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 9px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('📍 ' + (city || 'Multiple Locations'), 40, 143);
    ctx.fillText('📊 ' + recordCount + ' data point' + (recordCount > 1 ? 's' : ''), 40, 155);
    
    // Action button
    ctx.fillStyle = '#0891b2';
    ctx.fillRect(canvas.width - 50, 125, 35, 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIEW', canvas.width - 32.5, 135);
    ctx.textAlign = 'left';
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    });
    
  } else if (style.layout === 'social') {
    // FindFolk - Enhanced social media platform
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Social media header with gradient
    const socialGradient = ctx.createLinearGradient(0, 0, 0, 40);
    socialGradient.addColorStop(0, '#7c3aed');
    socialGradient.addColorStop(1, '#a855f7');
    ctx.fillStyle = socialGradient;
    ctx.fillRect(0, 0, canvas.width, 40);
    
    // Header shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 40, canvas.width, 2);
    
    // Platform branding
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('👥', 12, 25);
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('FindFolk', 32, 25);
    
    // Network count badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(canvas.width - 70, 10, 60, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('2.3M+ Users', canvas.width - 65, 22);
    
    // Search result card with shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(12, 52, canvas.width - 24, 90);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 50, canvas.width - 20, 90);
    
    // Modern card border
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 50, canvas.width - 20, 90);
    
    // Profile section header
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(15, 55, canvas.width - 30, 25);
    
    // Profile picture with modern design
    const avatarGradient = ctx.createLinearGradient(20, 65, 40, 85);
    avatarGradient.addColorStop(0, '#7c3aed');
    avatarGradient.addColorStop(1, '#a855f7');
    ctx.fillStyle = avatarGradient;
    ctx.beginPath();
    ctx.arc(30, 75, 12, 0, 2 * Math.PI);
    ctx.fill();
    
    // Profile avatar border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Avatar icon
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👤', 30, 80);
    ctx.textAlign = 'left';
    
    // Verified badge
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(38, 67, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '6px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓', 38, 70);
    ctx.textAlign = 'left';
    
    // Profile info with enhanced typography
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(firstName + ' ' + lastName, 50, 70);
    ctx.fillStyle = '#6b7280';
    ctx.font = '8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('📍 ' + (city || 'Multiple Locations'), 50, 82);
    
    // Connection stats
    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('SOCIAL PROFILE FOUND', 15, 95);
    
    // Network data
    ctx.fillStyle = '#1f2937';
    ctx.font = '8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('🔗 Found in ' + recordCount + ' social network' + (recordCount > 1 ? 's' : ''), 15, 108);
    ctx.fillText('👥 Connections: ' + Math.ceil(recordCount * 12) + '+', 15, 120);
    ctx.fillText('📊 Profile activity: ' + (recordCount > 1 ? 'High' : 'Moderate'), 15, 132);
    
    // Action buttons
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(canvas.width - 80, 110, 35, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIEW', canvas.width - 62.5, 120);
    
    ctx.fillStyle = 'rgba(124, 58, 237, 0.1)';
    ctx.fillRect(canvas.width - 40, 110, 25, 16);
    ctx.fillStyle = '#7c3aed';
    ctx.fillText('•••', canvas.width - 27.5, 120);
    ctx.textAlign = 'left';
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    });
    
  } else if (style.layout === 'map') {
    // Locate - Enhanced GPS and mapping interface
    ctx.fillStyle = '#f0fdf4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Enhanced map background with topographic feel
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath(); 
      ctx.moveTo(i, 0); 
      ctx.lineTo(i, canvas.height); 
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath(); 
      ctx.moveTo(0, i); 
      ctx.lineTo(canvas.width, i); 
      ctx.stroke();
    }
    
    // Map coordinates overlay
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 10) {
      ctx.beginPath(); 
      ctx.moveTo(i, 0); 
      ctx.lineTo(i, canvas.height); 
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 10) {
      ctx.beginPath(); 
      ctx.moveTo(0, i); 
      ctx.lineTo(canvas.width, i); 
      ctx.stroke();
    }
    
    // GPS header with gradient
    const gpsGradient = ctx.createLinearGradient(0, 0, 0, 35);
    gpsGradient.addColorStop(0, '#059669');
    gpsGradient.addColorStop(1, '#047857');
    ctx.fillStyle = gpsGradient;
    ctx.fillRect(0, 0, canvas.width, 35);
    
    // Header shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 35, canvas.width, 2);
    
    // GPS branding
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('📍', 8, 22);
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Locate GPS', 28, 22);
    
    // Satellite count
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '7px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('🛰️ 12 satellites', canvas.width - 60, 22);
    
    // Location accuracy indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(8, 5, 80, 12);
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Accuracy: ±3m', 12, 13);
    
    // Multiple location pins for tracking history
    const locations = [
      { x: 80, y: 70, active: false },
      { x: 150, y: 90, active: false },
      { x: 200, y: 110, active: false },
      { x: 120, y: 130, active: true } // Current location
    ];
    
    // Draw tracking path
    ctx.strokeStyle = 'rgba(5, 150, 105, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    locations.forEach((loc, idx) => {
      if (idx === 0) ctx.moveTo(loc.x, loc.y);
      else ctx.lineTo(loc.x, loc.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw location pins
    locations.forEach((loc, idx) => {
      if (loc.active) {
        // Current location - larger, animated pin
        ctx.fillStyle = '#dc2626';
        ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📍', loc.x, loc.y);
        
        // Pulsing circle
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(loc.x, loc.y - 5, 15, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(loc.x, loc.y - 5, 20, 0, 2 * Math.PI);
        ctx.stroke();
      } else {
        // Historical locations
        ctx.fillStyle = 'rgba(5, 150, 105, 0.7)';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📍', loc.x, loc.y);
      }
    });
    ctx.textAlign = 'left';
    
    // Information panel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(8, 45, canvas.width - 16, 50);
    ctx.strokeStyle = 'rgba(5, 150, 105, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 45, canvas.width - 16, 50);
    
    // Target information
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 9px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('LOCATION INTELLIGENCE', 12, 58);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 9px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(firstName + ' ' + lastName, 12, 72);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('📍 Current: ' + (city || 'Unknown Location'), 12, 84);
    ctx.fillText('🗺️ ' + recordCount + ' location' + (recordCount > 1 ? 's' : '') + ' tracked', 12, 96);
    
    // Coordinates
    ctx.fillStyle = '#059669';
    ctx.font = '7px Courier New, monospace';
    ctx.fillText('Lat: 40.7128°N', canvas.width - 80, 84);
    ctx.fillText('Lng: 74.0060°W', canvas.width - 80, 96);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => { 
        resolve(URL.createObjectURL(blob)); 
      }, 'image/png');
    });
    
  } else if (style.layout === 'ai') {
    // SearchBot - Enhanced AI chat interface
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Modern AI header with gradient
    const aiGradient = ctx.createLinearGradient(0, 0, 0, 40);
    aiGradient.addColorStop(0, '#374151');
    aiGradient.addColorStop(1, '#1f2937');
    ctx.fillStyle = aiGradient;
    ctx.fillRect(0, 0, canvas.width, 40);
    
    // AI branding with neural network aesthetic
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('🤖', 10, 25);
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('SearchBot AI', 32, 25);
    
    // Processing indicator
    ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.fillRect(canvas.width - 60, 15, 50, 10);
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('PROCESSING', canvas.width - 55, 22);
    
    // Chat interface background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, 45, canvas.width - 10, canvas.height - 50);
    
    // User message bubble (right-aligned)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(canvas.width - 180, 55, 170, 25);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Search: "' + firstName + ' ' + lastName + '"', canvas.width - 175, 68);
    ctx.fillText('Location: ' + (city || 'Any'), canvas.width - 175, 78);
    
    // AI response bubble (left-aligned)
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(10, 90, 200, 35);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 90, 200, 35);
    
    // AI avatar
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(20, 100, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🤖', 20, 104);
    ctx.textAlign = 'left';
    
    // AI message content
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('SearchBot AI', 30, 98);
    ctx.fillStyle = '#374151';
    ctx.font = '8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('🔍 Analysis complete!', 30, 108);
    ctx.fillText('📊 Found ' + recordCount + ' matching record' + (recordCount > 1 ? 's' : ''), 30, 118);
    
    // Status indicators
    ctx.fillStyle = '#10b981';
    ctx.fillRect(10, 135, 80, 15);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✅ SCAN COMPLETE', 50, 144);
    
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(100, 135, 80, 15);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('⚡ AI POWERED', 140, 144);
    ctx.textAlign = 'left';
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => { 
        resolve(URL.createObjectURL(blob)); 
      }, 'image/png');
    });
    
  } else if (style.layout === 'gradient') {
    // PeopleConnect - Enhanced social intelligence platform
    ctx.fillStyle = '#fdf2f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Enhanced gradient header
    const socialConnectGradient = ctx.createLinearGradient(0, 0, canvas.width, 40);
    socialConnectGradient.addColorStop(0, '#be185d');
    socialConnectGradient.addColorStop(0.5, '#ec4899');
    socialConnectGradient.addColorStop(1, '#f472b6');
    ctx.fillStyle = socialConnectGradient;
    ctx.fillRect(0, 0, canvas.width, 40);
    
    // Header pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < canvas.width; i += 15) {
      ctx.fillRect(i, 0, 1, 40);
    }
    
    // Platform branding
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('🌐', 10, 25);
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('PeopleConnect', 32, 25);
    
    // Intelligence badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(canvas.width - 80, 8, 70, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('INTELLIGENCE', canvas.width - 75, 18);
    ctx.fillText('PLATFORM', canvas.width - 75, 28);
    
    // Main intelligence card
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(10, 52, canvas.width - 20, 85);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, 50, canvas.width - 16, 85);
    
    // Card gradient border
    const cardBorderGradient = ctx.createLinearGradient(8, 50, canvas.width - 8, 135);
    cardBorderGradient.addColorStop(0, '#ec4899');
    cardBorderGradient.addColorStop(1, '#be185d');
    ctx.strokeStyle = cardBorderGradient;
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 50, canvas.width - 16, 85);
    
    // Profile section
    ctx.fillStyle = '#fdf2f8';
    ctx.fillRect(12, 54, canvas.width - 24, 30);
    
    // Profile avatar with gradient
    const avatarGradient = ctx.createLinearGradient(22, 64, 42, 84);
    avatarGradient.addColorStop(0, '#ec4899');
    avatarGradient.addColorStop(1, '#be185d');
    ctx.fillStyle = avatarGradient;
    ctx.beginPath();
    ctx.arc(32, 74, 12, 0, 2 * Math.PI);
    ctx.fill();
    
    // Profile frame
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Avatar icon
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👤', 32, 79);
    ctx.textAlign = 'left';
    
    // Profile info
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(firstName + ' ' + lastName, 50, 70);
    ctx.fillStyle = '#6b7280';
    ctx.font = '8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('🌐 Social Intelligence Profile', 50, 82);
    
    // Intelligence metrics
    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 9px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('NETWORK ANALYSIS', 12, 100);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = '8px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('🔗 Connected to ' + recordCount + ' social network' + (recordCount > 1 ? 's' : ''), 12, 112);
    ctx.fillText('📊 Influence score: ' + (recordCount * 23 + 45) + '/100', 12, 124);
    ctx.fillText('💼 Professional profile: Verified', 12, 136);
    
    // Status indicator
    ctx.fillStyle = '#10b981';
    ctx.fillRect(canvas.width - 60, 115, 40, 12);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 6px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ACTIVE', canvas.width - 40, 123);
    ctx.textAlign = 'left';
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => { 
        resolve(URL.createObjectURL(blob)); 
      }, 'image/png');
    });
    
  } else if (style.layout === 'premium') {
    // PremiumDirectory - Enhanced exclusive directory
    ctx.fillStyle = '#fffef7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Premium outer frame with multiple borders
    const premiumGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    premiumGradient.addColorStop(0, '#fbbf24');
    premiumGradient.addColorStop(0.5, '#f59e0b');
    premiumGradient.addColorStop(1, '#d97706');
    ctx.strokeStyle = premiumGradient;
    ctx.lineWidth = 3;
    ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
    
    // Inner premium border
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
    
    // Premium header with gradient
    const headerGradient = ctx.createLinearGradient(0, 0, 0, 45);
    headerGradient.addColorStop(0, '#dc2626');
    headerGradient.addColorStop(1, '#b91c1c');
    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 0, canvas.width, 45);
    
    // Premium pattern overlay
    ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < 45; j += 20) {
        ctx.fillRect(i, j, 10, 1);
        ctx.fillRect(i, j + 10, 10, 1);
      }
    }
    
    // Premium branding
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 16px "Times New Roman", serif';
    ctx.fillText('⭐', 8, 25);
    ctx.font = 'bold 12px "Times New Roman", serif';
    ctx.fillText('PREMIUM', 30, 25);
    ctx.font = '8px "Times New Roman", serif';
    ctx.fillText('DIRECTORY', 30, 35);
    
    // Exclusivity badge
    ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
    ctx.fillRect(canvas.width - 80, 5, 75, 35);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 7px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText('EXCLUSIVE', canvas.width - 42.5, 18);
    ctx.fillText('MEMBER', canvas.width - 42.5, 28);
    ctx.fillText('ACCESS', canvas.width - 42.5, 38);
    ctx.textAlign = 'left';
    
    // Premium member card
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(12, 57, canvas.width - 24, 75);
    
    const memberCardGradient = ctx.createLinearGradient(10, 55, 10, 130);
    memberCardGradient.addColorStop(0, '#fbbf24');
    memberCardGradient.addColorStop(0.5, '#f59e0b');
    memberCardGradient.addColorStop(1, '#d97706');
    ctx.fillStyle = memberCardGradient;
    ctx.fillRect(10, 55, canvas.width - 20, 75);
    
    // Card pattern
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let i = 10; i < canvas.width - 10; i += 15) {
      ctx.fillRect(i, 55, 1, 75);
    }
    
    // Member seal
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(canvas.width - 35, 75, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(canvas.width - 35, 75, 12, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 8px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText('ELITE', canvas.width - 35, 78);
    ctx.textAlign = 'left';
    
    // Member information
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 10px "Times New Roman", serif';
    ctx.fillText('PREMIUM MEMBER', 15, 75);
    
    ctx.font = 'bold 9px "Times New Roman", serif';
    ctx.fillText(firstName.toUpperCase() + ' ' + lastName.toUpperCase(), 15, 90);
    
    ctx.font = '8px "Times New Roman", serif';
    ctx.fillText('Member ID: PM-' + String(recordCount + 1000).padStart(4, '0'), 15, 105);
    ctx.fillText('Tier: Executive Level', 15, 117);
    ctx.fillText('Records: ' + recordCount + ' Premium Entries', 15, 129);
    
    // Premium badge corner
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(10, 55, 25, 15);
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 6px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIP', 22.5, 65);
    ctx.textAlign = 'left';
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => { 
        resolve(URL.createObjectURL(blob)); 
      }, 'image/png');
    });
    
  } else {
    // Default fallback style (should not be reached with current site definitions)
    ctx.fillStyle = style.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = style.primaryColor;
    ctx.fillRect(0, 0, canvas.width, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 10px Arial`;
    ctx.fillText(`${style.emoji} ${siteName}`, 8, 20);
    
    // Minimal branding for fallback only
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 9px Arial';
    ctx.fillText(`"${firstName} ${lastName}"`, 8, 45);
    ctx.fillStyle = '#6b7280';
    ctx.font = '8px Arial';
    ctx.fillText(`Found ${recordCount} record${recordCount === 1 ? '' : 's'}`, 8, 60);
  }
  
  // Convert canvas to blob URL
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      resolve(url);
    }, 'image/png');
  });
};

// Site configuration for the scanning sequence
export const localhostSites = [
  { name: 'PeopleTrace', port: 4001, category: 'People Search Engines' },
  { name: 'FindFolk', port: 4002, category: 'Social Media Analysis' },
  { name: 'Locate', port: 4003, category: 'Contact Info Brokers' },
  { name: 'PremiumDirectory', port: 4004, category: 'Professional Networks' },
  { name: 'CyberTrace', port: 4005, category: 'Background Check Sites' },
  { name: 'SearchMate', port: 4006, category: 'People Search Engines' },
  { name: 'PeopleConnect', port: 4007, category: 'Contact Info Brokers' },
  { name: 'FindPerson', port: 4008, category: 'People Search Engines' },
  { name: 'EliteTracker', port: 4009, category: 'Background Check Sites' },
  { name: 'SearchBot', port: 4010, category: 'People Search Engines' }
];

// External data broker sites - only working ones (not blocked by Cloudflare)
export const externalDataBrokerSites = [
  { url: 'https://dataveria.com/profile/search?fname={firstName}&lname={lastName}', siteName: 'Dataveria', category: 'People Search Engines' },
  { url: 'https://clubset.com/profile/search?fname={firstName}&lname={lastName}&state=&city=&fage=None', siteName: 'Clubset', category: 'Social Media Analysis' },
  { url: 'https://arrestfacts.com/ng/search?fname={firstName}&lname={lastName}&state=&city=', siteName: 'ArrestFacts', category: 'Background Check Sites' },
  { url: 'https://clustrmaps.com/persons/{firstName}-{lastName}', siteName: 'ClustrMaps', category: 'People Search Engines' },
  { url: 'https://www.peekyou.com/{firstName}_{lastName}', siteName: 'PeekYou', category: 'Social Media Analysis' },
  { url: 'https://www.corporationwiki.com/search/results?term={firstName}%20{lastName}', siteName: 'Corporation Wiki', category: 'Professional Networks' }
];