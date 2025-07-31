// Account Deleter Tool - Help users delete accounts from various platforms
import React, { useState } from 'react';
import BaseTool, { ToolResult } from './BaseTool';
import { FaTrash, FaSearch, FaExternalLinkAlt } from 'react-icons/fa';

const AccountDeleterTool = ({ onComplete, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  // Popular platforms with deletion instructions
  const platforms = [
    { name: 'Facebook', difficulty: 'Medium', url: 'https://www.facebook.com/help/delete_account' },
    { name: 'Instagram', difficulty: 'Easy', url: 'https://www.instagram.com/accounts/remove/request/permanent/' },
    { name: 'Twitter/X', difficulty: 'Easy', url: 'https://help.twitter.com/en/managing-your-account/how-to-deactivate-twitter-account' },
    { name: 'LinkedIn', difficulty: 'Easy', url: 'https://www.linkedin.com/help/linkedin/answer/63' },
    { name: 'TikTok', difficulty: 'Easy', url: 'https://support.tiktok.com/en/account-and-privacy/deleting-an-account' },
    { name: 'Snapchat', difficulty: 'Medium', url: 'https://accounts.snapchat.com/accounts/delete_account' },
    { name: 'Pinterest', difficulty: 'Easy', url: 'https://help.pinterest.com/en/article/delete-your-account' },
    { name: 'Reddit', difficulty: 'Easy', url: 'https://www.reddit.com/settings/account' },
    { name: 'WhatsApp', difficulty: 'Easy', url: 'https://faq.whatsapp.com/android/account-and-profile/how-to-delete-your-account' },
    { name: 'Spotify', difficulty: 'Medium', url: 'https://support.spotify.com/us/article/close-account/' }
  ];

  const filteredPlatforms = platforms.filter(platform =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev => {
      const isSelected = prev.some(p => p.name === platform.name);
      if (isSelected) {
        return prev.filter(p => p.name !== platform.name);
      } else {
        return [...prev, platform];
      }
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#4caf50';
      case 'Medium': return '#ffc107';
      case 'Hard': return '#ff3b3b';
      default: return '#666';
    }
  };

  const generateDeletionPlan = () => {
    if (selectedPlatforms.length === 0) return;

    onComplete({
      type: 'account_deletion_plan',
      data: {
        platforms: selectedPlatforms,
        totalPlatforms: selectedPlatforms.length
      },
      summary: `Created deletion plan for ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}`
    });
  };

  return (
    <BaseTool
      toolName="Account Deletion Assistant"
      toolIcon="🗑️"
      toolDescription="Get help deleting accounts from various platforms"
      onClose={onClose}
    >
      <div className="account-deleter-content">
        <div className="search-section">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search platforms..."
              className="platform-search"
            />
          </div>
        </div>

        <div className="platforms-section">
          <h4>Select platforms to delete:</h4>
          <div className="platforms-grid">
            {filteredPlatforms.map((platform) => {
              const isSelected = selectedPlatforms.some(p => p.name === platform.name);
              return (
                <div
                  key={platform.name}
                  className={`platform-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => togglePlatform(platform)}
                >
                  <div className="platform-header">
                    <span className="platform-name">{platform.name}</span>
                    <span 
                      className="difficulty-badge"
                      style={{ color: getDifficultyColor(platform.difficulty) }}
                    >
                      {platform.difficulty}
                    </span>
                  </div>
                  <button
                    className="deletion-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(platform.url, '_blank');
                    }}
                  >
                    <FaExternalLinkAlt />
                    Delete Account
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {selectedPlatforms.length > 0 && (
          <div className="selected-platforms">
            <h4>Selected for deletion ({selectedPlatforms.length}):</h4>
            <div className="selected-list">
              {selectedPlatforms.map((platform) => (
                <span key={platform.name} className="selected-platform">
                  {platform.name}
                  <button
                    className="remove-btn"
                    onClick={() => togglePlatform(platform)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <button 
              className="generate-plan-btn"
              onClick={generateDeletionPlan}
            >
              <FaTrash />
              Generate Deletion Plan
            </button>
          </div>
        )}

        <div className="deletion-tips">
          <h4>💡 Deletion Tips:</h4>
          <ul>
            <li>Download your data before deleting (if needed)</li>
            <li>Remove personal information from profiles first</li>
            <li>Some platforms have waiting periods before final deletion</li>
            <li>Check for connected apps and services to disconnect</li>
          </ul>
        </div>
      </div>
    </BaseTool>
  );
};

export default AccountDeleterTool;