import React from 'react';
import { getGoogleMapsConfig } from '../config/environment';

const GoogleMapsComponent: React.FC = () => {
  const mapConfig = getGoogleMapsConfig();
  
  React.useEffect(() => {
    // Example of loading Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapConfig.key}&libraries=${mapConfig.libraries.join(',')}&v=${mapConfig.version}`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ height: '400px', width: '100%' }} />
    </div>
  );
};

export default GoogleMapsComponent; 