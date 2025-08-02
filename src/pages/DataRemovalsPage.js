import React, { useState, useEffect } from 'react';
import { FaSpinner, FaCircle } from 'react-icons/fa';
// Lightbox removed due to React 18 compatibility issues
import './DataRemovalsPage.css';
import NavigationTabs from '../components/NavigationTabs';
import DataPointsComponent from '../components/DataPointsComponent';
import DataBrokerListComponent from '../components/DataBrokerListComponent';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNavBar from '../components/MobileNavbar';

const auth = '72382-cd';
const thumbioKey = '72571-1234';

// Add API base URL constant
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://cleandata-test-app-961214fcb16c.herokuapp.com/api'
  : 'http://localhost:5002/api';

const DataRemovalsPage = () => {
  const defaultFirstName = 'Andy ';
  const defaultLastName = 'Burns';

  // Move validateUrl to the top
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      console.error('Invalid URL:', url);
      return false;
    }
  };

  // Then the generateUrls function that uses validateUrl
  const generateUrls = (firstName, lastName) => {
    const urls = [
      { url: `https://dataveria.com/profile/search?fname=${firstName}&lname=${lastName}`, siteName: 'Dataveria' },
      { url: `https://411.info/people?fn=${firstName}&ln=${lastName}`, siteName: '411.info' },
      { url: `https://www.anywho.com/people/${firstName}%20+${lastName}/`, siteName: 'AnyWho' },
      { url: `https://www.addresses.com/people/${firstName}+${lastName}/`, siteName: 'Addresses.com' },
      { url: `https://arrestfacts.com/ng/search?fname=${firstName}&lname=${lastName}&state=&city=`, siteName: 'ArrestFacts' },
      { url: `https://clubset.com/profile/search?fname=${firstName}&lname=${lastName}&state=&city=&fage=None`, siteName: 'Clubset' },
      { url: `https://clustrmaps.com/persons/${firstName}-${lastName}`, siteName: 'ClustrMaps' },
      { url: `https://www.corporationwiki.com/search/results?term=${firstName}%20${lastName}`, siteName: 'Corporation Wiki' },
      { url: `https://fastpeoplesearch.io/search?first_name=${firstName}&last_name=${lastName}&state=`, siteName: 'FastPeopleSearch.io' },
      { url: `https://freepeopledirectory.com/name/${firstName}-${lastName}/`, siteName: 'FreePeopleDirectory' },
      { url: `https://neighbor.report/${firstName}-${lastName}`, siteName: 'Neighbor Report' },
      { url: `https://www.peekyou.com/${firstName}_${lastName}`, siteName: 'PeekYou' },
    ];

    urls.forEach(item => {
      if (!validateUrl(item.url)) {
        console.error(`Invalid URL generated for ${item.siteName}:`, item.url);
      }
    });

    return urls;
  };

  // Then the rest of your state declarations and functions
  const [userName, setUserName] = useState({ firstName: defaultFirstName, lastName: defaultLastName });
  const [urls, setUrls] = useState(generateUrls(defaultFirstName, defaultLastName));
  const [loadingStates, setLoadingStates] = useState({});
  const [fullImageIndex, setFullImageIndex] = useState(-1);
  const [rippleEffects, setRippleEffects] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [imageErrors, setImageErrors] = useState({});

  // Function to generate thum.io URL with retry mechanism
  const getThumbioUrl = (url, retry = false) => {
    // Basic encode of the target URL - using the parameter approach for better reliability
    const encodedUrl = encodeURIComponent(url);
    
    // Construct the thum.io URL with correct format
    const thumbioUrl = `https://image.thum.io/get/auth/${thumbioKey}/width/800/crop/600/noanimate${retry ? '/wait/2' : ''}/png/?url=${encodedUrl}`;
    
    // Log for debugging
    console.log('Original URL:', url);
    console.log('Thum.io URL:', thumbioUrl);
    
    return thumbioUrl;
  };

  // Add prefetch functionality for better performance
  const prefetchImage = async (url) => {
    try {
      const prefetchUrl = `https://image.thum.io/get/auth/${auth}/prefetch/${url}`;
      const response = await fetch(prefetchUrl);
      const text = await response.text();
      return text.includes("Image is cached");
    } catch (error) {
      console.error('Prefetch failed:', error);
      return false;
    }
  };

  // Update the image component with prefetch
  useEffect(() => {
    urls.forEach(item => {
      prefetchImage(item.url);
    });
  }, [urls]);

  // Enhanced error handling
  const handleImageError = async (url) => {
    console.log('Image load failed for:', url);
    
    if (!imageErrors[url]) {
      console.log('Attempting retry with longer wait time...');
      setImageErrors(prev => ({ ...prev, [url]: true }));
      
      const retryUrl = getThumbioUrl(url, true);
      console.log('Retry URL:', retryUrl);
      
      const img = new Image();
      img.src = retryUrl;
      img.onload = () => {
        console.log('Retry successful for:', url);
        handleImageLoad(url);
        setImageErrors(prev => ({ ...prev, [url]: false }));
      };
      img.onerror = (e) => {
        console.error('Retry failed for:', url, e);
        handleImageLoad(url);
      };
    } else {
      console.error('All retries failed for:', url);
      handleImageLoad(url);
    }
  };

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize loadingStates when urls change
  useEffect(() => {
    const initialLoadingStates = {};
    urls.forEach((item) => {
      initialLoadingStates[item.url] = true;
    });
    setLoadingStates(initialLoadingStates);
  }, [urls]);

  // Fetch user data and update URLs
  useEffect(() => {
    const fetchUserName = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found, using default user name');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/user-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch user data, status:', response.status);
          return;
        }

        const user = await response.json();
        const firstName = user.first_name || defaultFirstName;
        const lastName = user.last_name || defaultLastName;
        setUserName({ firstName, lastName });
        updateUrls(firstName, lastName);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserName();
  }, []);

  // Update URLs and reset loading states
  const updateUrls = (firstName, lastName) => {
    const newUrls = generateUrls(firstName, lastName);
    setUrls(newUrls);
    // The loadingStates will be reset by the useEffect that depends on urls
  };

  const handleImageLoad = (url) => {
    setLoadingStates((prevStates) => ({
      ...prevStates,
      [url]: false,
    }));
  };

  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = resolve;
      img.onerror = reject;
    });
  };

  const handleImageClick = async (url) => {
    try {
      // Start loading the full image immediately when clicked
      const fullImageUrl = `https://image.thum.io/get/auth/${auth}/noanimate/fullpage/maxAge/0/?url=${encodeURIComponent(url)}&timestamp=${Date.now()}`;
      await preloadImage(fullImageUrl);
      
      const index = urls.findIndex((item) => item.url === url);
      setFullImageIndex(index);
      setRippleEffects((prev) => ({ ...prev, [url]: true }));
      
      setTimeout(() => {
        setRippleEffects((prev) => ({ ...prev, [url]: false }));
      }, 600);
    } catch (error) {
      console.error('Failed to load full image:', error);
    }
  };

  // Simplified screenshot URL generation
  const getScreenshotUrl = (url) => {
    try {
      // Remove any double slashes except for http(s)://
      const cleanUrl = url.replace(/(https?:\/\/)|(\/)+/g, "$1$2");
      return `https://image.thum.io/get/auth/${auth}/width/800/crop/600/${cleanUrl}`;
    } catch (error) {
      console.error('URL generation error:', error);
      return null;
    }
  };

  // Lightbox temporarily removed due to React 18 compatibility issues
  // TODO: Replace with React 18 compatible image viewer

  const LiveIndicator = () => (
    <div className="live-indicator">
      <div className="recording-dot"></div>
      <span>LIVE SCAN</span>
    </div>
  );

  const ImagePreview = ({ item, onImageClick }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const screenshotUrl = getScreenshotUrl(item.url);

    return (
      <div 
        className={`image-preview ${isLoading ? 'loading' : ''} ${loadError ? 'error' : ''}`}
        onClick={() => !isLoading && onImageClick(item.url)}
      >
        <div className="preview-content">
          {isLoading && (
            <div className="loading-state">
              <div className="cyber-spinner"></div>
              <span>Scanning {item.siteName}</span>
            </div>
          )}
          
          <img
            src={screenshotUrl}
            alt={`${item.siteName} Analysis`}
            className={`preview-image ${isLoading ? 'hidden' : ''}`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setLoadError(true);
              setIsLoading(false);
            }}
          />

          {!isLoading && !loadError && (
            <div className="cyber-overlay">
              <LiveIndicator />
              <div className="site-info">
                <span className="site-name">{item.siteName}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {isMobile ? <MobileNavBar /> : <Navbar />}
      <div className="data-leak-page">
        <Sidebar />
        <div className="content-wrapper">
          <div className="data-leak-header">
            <h1>Real-Time Data Broker Monitoring</h1>
            <p className="header-description">
              Active surveillance of your digital footprint across major data broker platforms
            </p>
          </div>

          <div className="data-points-section fade-in">
            <div className="removal-images-container">
              {urls.map((item) => (
                <ImagePreview
                  key={item.url}
                  item={item}
                  onImageClick={handleImageClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataRemovalsPage;
