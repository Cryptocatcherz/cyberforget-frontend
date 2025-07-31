// IP Geolocation utility for automatic location detection
// Surprises users by showing their detected location

export const detectUserLocation = async () => {
  try {
    // Use multiple services for better reliability
    const services = [
      {
        url: 'https://ipapi.co/json/',
        parser: (data) => ({
          city: data.city,
          country: data.country_name,
          region: data.region,
          ip: data.ip,
          provider: 'ipapi'
        })
      },
      {
        url: 'https://api.ipgeolocation.io/ipgeo?apiKey=free',
        parser: (data) => ({
          city: data.city,
          country: data.country_name,
          region: data.state_prov,
          ip: data.ip,
          provider: 'ipgeolocation'
        })
      },
      {
        url: 'https://freeipapi.com/api/json',
        parser: (data) => ({
          city: data.cityName,
          country: data.countryName,
          region: data.regionName,
          ip: data.ipAddress,
          provider: 'freeipapi'
        })
      }
    ];

    // Try services in order until one succeeds
    for (const service of services) {
      try {
        const response = await fetch(service.url);
        if (response.ok) {
          const data = await response.json();
          const location = service.parser(data);
          
          // Validate we got meaningful data
          if (location.city && location.country) {
            console.log(`Location detected via ${location.provider}:`, location);
            return location;
          }
        }
      } catch (error) {
        console.warn(`Failed to get location from ${service.url}:`, error);
        continue;
      }
    }

    // Fallback if all services fail
    return {
      city: 'Unknown City',
      country: 'Unknown Country',
      region: 'Unknown Region',
      ip: 'Unknown IP',
      provider: 'fallback'
    };

  } catch (error) {
    console.error('Error detecting user location:', error);
    return {
      city: 'Unknown City',
      country: 'Unknown Country',
      region: 'Unknown Region',
      ip: 'Unknown IP',
      provider: 'error'
    };
  }
};

// Format location for display
export const formatLocationForDisplay = (location) => {
  if (!location.city || !location.country) {
    return 'Unknown Location';
  }
  
  return `${location.city}, ${location.country}`;
};

// Format location for search queries
export const formatLocationForSearch = (location) => {
  if (!location.city) {
    return 'unknown';
  }
  
  return location.city.toLowerCase().replace(/\s+/g, '+');
};