const fs = require('fs');
const sites = require('../src/sites-enhanced.json');
const areaCodesList = require('../src/scripts/area-codes-list.json');

const generateSitemap = () => {
  const baseUrl = 'https://app.cleandata.me';

  // Helper function to encode special characters
  const encodeXMLChars = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/'/g, '&apos;')
      .replace(/"/g, '&quot;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;')
      .replace(/\//g, '-')
      .replace(/!/g, '');
  };

  // Public routes from your App.js
  const publicRoutes = [
    {
      path: '/login',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      path: '/signup',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      path: '/support',
      changefreq: 'weekly',
      priority: '0.6'
    },
    {
      path: '/location',
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      path: '/scanning',
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      path: '/results',
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      path: '/trial-signup',
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      path: '/data-leak',
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      path: '/password-check',
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      path: '/file-scan',
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      path: '/scamai',
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      path: '/delete-account',
      changefreq: 'daily',
      priority: '0.9'
    }
  ];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // Add public routes
  publicRoutes.forEach(route => {
    xml += `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
  });

  // Add deletion guide pages
  sites.forEach(site => {
    const siteName = site.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric character with a hyphen
      .replace(/-+/g, '-')         // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-|-$/g, '');      // Remove hyphens from start and end
      
    xml += `  <url>
    <loc>${baseUrl}/delete-account/how-to-delete-my-account-on-${siteName}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  // Add area code pages
  areaCodesList.areaCodes.forEach(areaCode => {
    xml += `  <url>
    <loc>${baseUrl}/area-codes/${areaCode.areaCode}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  // Add the main area codes directory page
  xml += `  <url>
    <loc>${baseUrl}/area-codes</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;

  xml += '</urlset>';

  fs.writeFileSync('public/sitemap.xml', xml);
  console.log('Sitemap generated successfully!');
  console.log(`Total area code pages added: ${areaCodesList.areaCodes.length}`);
};

generateSitemap(); 