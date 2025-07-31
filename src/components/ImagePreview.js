// src/components/ImagePreview.js
import React, { useState } from 'react';
import LiveIndicator from './LiveIndicator';

const auth = '72382-cd'; // Move this to an environment variable in production

const getScreenshotUrl = (url) => {
  try {
    const cleanUrl = url.replace(/(https?:\/\/)|(\/)+/g, "$1$2");
    return `https://image.thum.io/get/auth/${auth}/width/800/crop/600/${cleanUrl}`;
  } catch (error) {
    console.error('URL generation error:', error);
    return null;
  }
};

const ImagePreview = ({ item, onImageClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  
  // Early return if item is not provided
  if (!item || !item.url) {
    return (
      <div className="image-preview error">
        <div className="preview-content">
          <div className="loading-state">
            <span>Loading preview...</span>
          </div>
        </div>
      </div>
    );
  }
  
  const screenshotUrl = getScreenshotUrl(item.url);

  return (
    <div 
      className={`image-preview ${isLoading ? 'loading' : ''} ${loadError ? 'error' : ''}`}
      onClick={() => !isLoading && onImageClick && onImageClick(item.url)}
    >
      <div className="preview-content">
        {isLoading && (
          <div className="loading-state">
            <div className="cyber-spinner"></div>
            <span>Scanning {item.siteName || 'site'}</span>
          </div>
        )}
        
        <img
          src={screenshotUrl}
          alt={`${item.siteName || 'Site'} Analysis`}
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
              <span className="site-name">{item.siteName || 'Unknown Site'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;