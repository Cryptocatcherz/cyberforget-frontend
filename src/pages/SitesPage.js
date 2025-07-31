import React, { useState } from 'react';
import peopleSearchSites from './peopleSearchSites';
import { FaSearch, FaUserShield, FaDatabase, FaPhoneAlt, FaEllipsisH } from 'react-icons/fa';
import './SitesPage.css';

// Helper function to format domain as URL
const formatUrl = (domain) => {
    return `https://${domain.toLowerCase()}`;
};

// Helper function to format domain for display
const formatDisplayName = (domain) => {
    return domain.replace(/\.(com|net|org)$/, '');
};

// Organize sites into categories
const siteCategories = [
    {
        name: 'Background Check Services',
        description: 'Sites that provide comprehensive background check services',
        icon: <FaSearch />,
        sites: peopleSearchSites.filter(site => 
            site.includes('background') || 
            site.includes('check') || 
            site.includes('record')
        )
    },
    {
        name: 'People Search Directories',
        description: 'General people search and directory services',
        icon: <FaUserShield />,
        sites: peopleSearchSites.filter(site => 
            site.includes('people') || 
            site.includes('search') || 
            site.includes('directory')
        )
    },
    {
        name: 'Public Records',
        description: 'Sites that aggregate and display public records',
        icon: <FaDatabase />,
        sites: peopleSearchSites.filter(site => 
            site.includes('public') || 
            site.includes('records') || 
            site.includes('info')
        )
    },
    {
        name: 'Phone & Address Lookup',
        description: 'Services for phone number and address lookups',
        icon: <FaPhoneAlt />,
        sites: peopleSearchSites.filter(site => 
            site.includes('phone') || 
            site.includes('address') || 
            site.includes('lookup')
        )
    },
    {
        name: 'Other Data Brokers',
        description: 'Additional data broker and information aggregator sites',
        icon: <FaEllipsisH />,
        sites: peopleSearchSites.filter(site => 
            !site.includes('background') && 
            !site.includes('check') && 
            !site.includes('record') &&
            !site.includes('people') && 
            !site.includes('search') && 
            !site.includes('directory') &&
            !site.includes('public') && 
            !site.includes('records') && 
            !site.includes('info') &&
            !site.includes('phone') && 
            !site.includes('address') && 
            !site.includes('lookup')
        )
    }
];

const SitesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedCard, setExpandedCard] = useState(null);

    const filteredCategories = siteCategories.filter(category => 
        selectedCategory === 'all' || category.name.toLowerCase() === selectedCategory
    );

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    return (
        <div className="sites-page">
                    <div className="sites-header">
                        <h1>Sites We Cover</h1>
                        <p>Advanced AI-powered data broker removal service with 24/7 automated monitoring</p>
                        
                        <div className="sites-stats">
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <div className="stat-number">{peopleSearchSites.length}</div>
                                    <div className="stat-label">Total Sites</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">24/7</div>
                                    <div className="stat-label">Monitoring</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">AI</div>
                                    <div className="stat-label">Powered</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">99%</div>
                                    <div className="stat-label">Success Rate</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="search-filter-container">
                            <div className="search-box">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search sites..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="search-input"
                                />
                            </div>
                            
                            <div className="category-filters">
                                <button 
                                    className={`filter-button ${selectedCategory === 'all' ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory('all')}
                                >
                                    All
                                </button>
                                {siteCategories.map((category, index) => (
                                    <button
                                        key={index}
                                        className={`filter-button ${selectedCategory === category.name.toLowerCase() ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(category.name.toLowerCase())}
                                    >
                                        {category.icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="categories-grid">
                        {filteredCategories.map((category, index) => (
                            <div 
                                key={index} 
                                className={`category-card ${expandedCard === index ? 'expanded' : ''}`}
                                onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                            >
                                <div className="sites-count">
                                    {category.sites.length} sites
                                </div>
                                <div className="category-header">
                                    <div className="category-icon">
                                        {category.icon}
                                    </div>
                                    <div className="category-info">
                                        <h3>{category.name}</h3>
                                        <p>{category.description}</p>
                                    </div>
                                </div>
                                <div className="sites-grid">
                                    {category.sites
                                        .filter(site => site.toLowerCase().includes(searchTerm))
                                        .map((site, siteIndex) => (
                                            <a 
                                                key={siteIndex} 
                                                href={formatUrl(site)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="site-item"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {formatDisplayName(site)}
                                            </a>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
    );
};

export default SitesPage;
