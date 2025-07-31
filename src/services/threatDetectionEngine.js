/**
 * Threat Detection Engine for Trial Users
 * Simulates realistic threat detection across various sites
 */

import sitesData from '../sites.json';
import peopleSearchSites from '../data/peopleSearchSites';

class ThreatDetectionEngine {
    constructor() {
        this.threatTemplates = this.initializeThreatTemplates();
        this.peopleSearchSites = peopleSearchSites;
        this.sitesDatabase = sitesData;
    }

    // Initialize threat templates for realistic simulation
    initializeThreatTemplates() {
        return {
            // Data Broker / People Search Sites
            people_search_sites: [
                {
                    threat_type: 'personal_info_exposure',
                    severity: 'high',
                    title: 'Personal Information Listed on People Search Site',
                    description: 'Your name, address, phone number, and associated relatives are publicly searchable',
                    exposed_data: ['name', 'address', 'phone', 'relatives', 'age'],
                    removal_difficulty: 'medium',
                    removal_method: 'contact_required',
                    confidence_base: 85
                },
                {
                    threat_type: 'address_exposure',
                    severity: 'high',
                    title: 'Current and Previous Addresses Exposed',
                    description: 'Your residential history including current address is publicly available',
                    exposed_data: ['current_address', 'previous_addresses', 'property_records'],
                    removal_difficulty: 'hard',
                    removal_method: 'email_request',
                    confidence_base: 78
                },
                {
                    threat_type: 'phone_exposure',
                    severity: 'medium',
                    title: 'Phone Number Publicly Listed',
                    description: 'Your phone number is associated with your name in public directories',
                    exposed_data: ['phone_number', 'carrier_info', 'location'],
                    removal_difficulty: 'easy',
                    removal_method: 'self_service',
                    confidence_base: 92
                }
            ],

            // Social Media & Professional Networks
            social_media: [
                {
                    threat_type: 'social_media_exposure',
                    severity: 'medium',
                    title: 'Public Social Media Profile Found',
                    description: 'Your social media profiles contain publicly accessible personal information',
                    exposed_data: ['profile_photo', 'work_info', 'location', 'connections'],
                    removal_difficulty: 'easy',
                    removal_method: 'self_service',
                    confidence_base: 95
                },
                {
                    threat_type: 'employment_info',
                    severity: 'medium',
                    title: 'Professional Information Exposed',
                    description: 'Your employment history and professional details are publicly visible',
                    exposed_data: ['employer', 'job_title', 'work_location', 'professional_skills'],
                    removal_difficulty: 'medium',
                    removal_method: 'contact_required',
                    confidence_base: 88
                }
            ],

            // Background Check & Public Records
            background_check: [
                {
                    threat_type: 'background_check_site',
                    severity: 'high',
                    title: 'Background Check Profile Available',
                    description: 'Detailed background information including criminal records, court cases, and personal details',
                    exposed_data: ['criminal_records', 'court_cases', 'liens', 'bankruptcies'],
                    removal_difficulty: 'very_hard',
                    removal_method: 'legal_required',
                    confidence_base: 70
                },
                {
                    threat_type: 'public_record',
                    severity: 'medium',
                    title: 'Public Records Aggregated',
                    description: 'Various public records have been compiled into a single profile',
                    exposed_data: ['voting_records', 'property_ownership', 'business_registrations'],
                    removal_difficulty: 'hard',
                    removal_method: 'manual_process',
                    confidence_base: 82
                }
            ],

            // Data Breaches
            data_breaches: [
                {
                    threat_type: 'email_breach',
                    severity: 'critical',
                    title: 'Email Address Found in Data Breach',
                    description: 'Your email address was found in a known data breach and may be associated with leaked passwords',
                    exposed_data: ['email', 'password_hash', 'account_details', 'personal_info'],
                    removal_difficulty: 'medium',
                    removal_method: 'contact_required',
                    confidence_base: 98
                }
            ],

            // Financial Information
            financial: [
                {
                    threat_type: 'financial_info',
                    severity: 'high',
                    title: 'Financial Information Exposed',
                    description: 'Property records, estimated income, or financial details are publicly accessible',
                    exposed_data: ['property_value', 'estimated_income', 'financial_records'],
                    removal_difficulty: 'hard',
                    removal_method: 'legal_required',
                    confidence_base: 75
                }
            ]
        };
    }

    // Simulate threat detection for a specific user
    async simulateUserScan(userData) {
        const { email, firstName, lastName, fullName } = userData;
        const threats = [];

        // Calculate realistic threat discovery rates
        const threatDiscoveryRates = {
            people_search_sites: 0.85, // 85% chance of finding on people search sites
            social_media: 0.70, // 70% chance of social media exposure
            background_check: 0.45, // 45% chance of background check sites
            data_breaches: 0.30, // 30% chance of email in breach
            financial: 0.25 // 25% chance of financial info exposure
        };

        // Generate threats for people search sites
        const peopleSearchThreats = this.generatePeopleSearchThreats(userData, threatDiscoveryRates.people_search_sites);
        threats.push(...peopleSearchThreats);

        // Generate threats for social media
        const socialMediaThreats = this.generateSocialMediaThreats(userData, threatDiscoveryRates.social_media);
        threats.push(...socialMediaThreats);

        // Generate threats for background check sites
        const backgroundThreats = this.generateBackgroundCheckThreats(userData, threatDiscoveryRates.background_check);
        threats.push(...backgroundThreats);

        // Generate email breach threats
        if (email) {
            const breachThreats = this.generateDataBreachThreats(userData, threatDiscoveryRates.data_breaches);
            threats.push(...breachThreats);
        }

        // Generate financial threats
        const financialThreats = this.generateFinancialThreats(userData, threatDiscoveryRates.financial);
        threats.push(...financialThreats);

        return this.prioritizeAndValidateThreats(threats);
    }

    // Generate threats for people search sites
    generatePeopleSearchThreats(userData, discoveryRate) {
        const threats = [];
        const selectedSites = this.selectRandomSites(this.peopleSearchSites, Math.floor(this.peopleSearchSites.length * discoveryRate));

        selectedSites.forEach(siteName => {
            const template = this.getRandomThreatTemplate('people_search_sites');
            const threat = this.createThreatFromTemplate(template, siteName, userData, 'People Search');
            threats.push(threat);
        });

        return threats;
    }

    // Generate threats for social media platforms
    generateSocialMediaThreats(userData, discoveryRate) {
        const threats = [];
        const socialMediaSites = this.getSocialMediaSites();
        const selectedSites = this.selectRandomSites(socialMediaSites, Math.floor(socialMediaSites.length * discoveryRate));

        selectedSites.forEach(site => {
            const template = this.getRandomThreatTemplate('social_media');
            const threat = this.createThreatFromTemplate(template, site.name, userData, site.category, site.url);
            threats.push(threat);
        });

        return threats;
    }

    // Generate threats for background check sites
    generateBackgroundCheckThreats(userData, discoveryRate) {
        const threats = [];
        const backgroundSites = [
            'BeenVerified', 'TruthFinder', 'Instant Checkmate', 'PeopleFinders',
            'Spokeo', 'Intelius', 'USSearch', 'PublicRecordsNow'
        ];

        const selectedSites = this.selectRandomSites(backgroundSites, Math.floor(backgroundSites.length * discoveryRate));

        selectedSites.forEach(siteName => {
            const template = this.getRandomThreatTemplate('background_check');
            const threat = this.createThreatFromTemplate(template, siteName, userData, 'Background Check');
            threats.push(threat);
        });

        return threats;
    }

    // Generate data breach threats
    generateDataBreachThreats(userData, discoveryRate) {
        const threats = [];
        
        if (Math.random() < discoveryRate) {
            const breachSources = [
                'LinkedIn Data Breach (2021)', 'Facebook Data Leak (2019)', 
                'Twitter Breach (2022)', 'Adobe Breach (2013)',
                'Equifax Breach (2017)', 'Yahoo Breach (2014)'
            ];

            const selectedBreach = breachSources[Math.floor(Math.random() * breachSources.length)];
            const template = this.getRandomThreatTemplate('data_breaches');
            const threat = this.createThreatFromTemplate(template, selectedBreach, userData, 'Data Breach');
            threats.push(threat);
        }

        return threats;
    }

    // Generate financial information threats
    generateFinancialThreats(userData, discoveryRate) {
        const threats = [];
        
        if (Math.random() < discoveryRate) {
            const financialSites = [
                'PropertyRadar', 'Zillow Public Records', 'County Assessor Records',
                'Business Registry', 'Court Records Database'
            ];

            const selectedSites = this.selectRandomSites(financialSites, 1);
            
            selectedSites.forEach(siteName => {
                const template = this.getRandomThreatTemplate('financial');
                const threat = this.createThreatFromTemplate(template, siteName, userData, 'Financial Records');
                threats.push(threat);
            });
        }

        return threats;
    }

    // Create threat object from template
    createThreatFromTemplate(template, siteName, userData, category, siteUrl = null) {
        // Personalize the threat description
        const personalizedDescription = this.personalizeDescription(template.description, userData);
        
        // Calculate confidence score with some randomization
        const confidenceVariation = Math.floor(Math.random() * 20) - 10; // ±10 variation
        const confidence = Math.max(50, Math.min(100, template.confidence_base + confidenceVariation));

        // Generate removal steps based on site
        const removalSteps = this.generateRemovalSteps(siteName, template.removal_method);
        const contactInfo = this.generateContactInfo(siteName, template.removal_method);

        return {
            site_name: siteName,
            site_url: siteUrl || this.generateSiteUrl(siteName),
            site_category: category,
            threat_type: template.threat_type,
            severity: template.severity,
            title: template.title.replace('{siteName}', siteName),
            description: personalizedDescription,
            exposed_data: this.personalizeExposedData(template.exposed_data, userData),
            removal_difficulty: template.removal_difficulty,
            removal_method: template.removal_method,
            removal_steps: removalSteps,
            removal_contact_info: contactInfo,
            confidence_score: confidence,
            is_trial_simulation: true,
            estimated_removal_time: this.estimateRemovalTime(template.removal_difficulty),
            priority_score: this.calculatePriorityScore(template.severity, confidence)
        };
    }

    // Personalize threat descriptions
    personalizeDescription(description, userData) {
        const { firstName, lastName, email } = userData;
        
        return description
            .replace(/\{firstName\}/g, firstName || 'your')
            .replace(/\{lastName\}/g, lastName || 'name')
            .replace(/\{email\}/g, email || 'your email')
            .replace(/\{fullName\}/g, `${firstName || ''} ${lastName || ''}`.trim() || 'your name');
    }

    // Personalize exposed data based on user info
    personalizeExposedData(exposedDataTemplate, userData) {
        const exposedData = {};
        
        exposedDataTemplate.forEach(dataType => {
            switch (dataType) {
                case 'name':
                    exposedData.name = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
                    break;
                case 'email':
                    exposedData.email = userData.email;
                    break;
                case 'phone':
                    exposedData.phone = this.generateFakePhone();
                    break;
                case 'address':
                    exposedData.address = this.generateFakeAddress();
                    break;
                case 'age':
                    exposedData.age = Math.floor(Math.random() * 40) + 25; // Random age 25-65
                    break;
                default:
                    exposedData[dataType] = true; // Boolean flag for other data types
            }
        });

        return exposedData;
    }

    // Generate realistic removal steps
    generateRemovalSteps(siteName, removalMethod) {
        const baseSteps = {
            self_service: [
                `Visit ${siteName} website`,
                'Navigate to privacy or opt-out section',
                'Submit removal request form',
                'Verify your identity if required',
                'Confirm removal via email'
            ],
            email_request: [
                `Find contact information for ${siteName}`,
                'Draft removal request email',
                'Include personal information to be removed',
                'Send email to privacy team',
                'Follow up if no response within 7 days'
            ],
            contact_required: [
                `Contact ${siteName} customer service`,
                'Request data removal over phone',
                'Provide identity verification',
                'Request confirmation in writing',
                'Monitor for compliance'
            ],
            legal_required: [
                'Gather documentation of data exposure',
                'Prepare formal legal notice',
                'Send certified letter to site owner',
                'Allow 30 days for compliance',
                'Consider legal action if non-compliant'
            ],
            manual_process: [
                `Research ${siteName} removal policies`,
                'Gather required documentation',
                'Submit removal request through official channels',
                'Provide additional verification if requested',
                'Monitor removal progress'
            ]
        };

        return baseSteps[removalMethod] || baseSteps.contact_required;
    }

    // Generate contact information
    generateContactInfo(siteName, removalMethod) {
        const contactInfo = {
            site_name: siteName,
            removal_method: removalMethod
        };

        // Add method-specific contact details
        switch (removalMethod) {
            case 'email_request':
                contactInfo.email = `privacy@${siteName.toLowerCase().replace(/\s+/g, '')}.com`;
                break;
            case 'contact_required':
                contactInfo.phone = this.generateFakePhone();
                contactInfo.email = `support@${siteName.toLowerCase().replace(/\s+/g, '')}.com`;
                break;
            case 'self_service':
                contactInfo.url = this.generateSiteUrl(siteName) + '/privacy';
                break;
            case 'legal_required':
                contactInfo.address = this.generateFakeBusinessAddress();
                contactInfo.legal_email = `legal@${siteName.toLowerCase().replace(/\s+/g, '')}.com`;
                break;
        }

        return contactInfo;
    }

    // Utility functions
    selectRandomSites(siteList, count) {
        const shuffled = [...siteList].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    getRandomThreatTemplate(category) {
        const templates = this.threatTemplates[category];
        return templates[Math.floor(Math.random() * templates.length)];
    }

    getSocialMediaSites() {
        return this.sitesDatabase.filter(site => 
            ['Social Media', 'Professional Networking', 'Dating', 'Community'].includes(site.category)
        );
    }

    generateSiteUrl(siteName) {
        return `https://${siteName.toLowerCase().replace(/\s+/g, '')}.com`;
    }

    generateFakePhone() {
        return `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    }

    generateFakeAddress() {
        const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr', 'Cedar Ln'];
        const number = Math.floor(Math.random() * 9999) + 1;
        const street = streets[Math.floor(Math.random() * streets.length)];
        return `${number} ${street}`;
    }

    generateFakeBusinessAddress() {
        return {
            street: this.generateFakeAddress(),
            city: 'Business City',
            state: 'CA',
            zip: '90210'
        };
    }

    estimateRemovalTime(difficulty) {
        const timeRanges = {
            easy: '1-3 days',
            medium: '1-2 weeks',
            hard: '2-4 weeks',
            very_hard: '1-3 months'
        };
        return timeRanges[difficulty] || '1-2 weeks';
    }

    calculatePriorityScore(severity, confidence) {
        const severityScores = { low: 1, medium: 2, high: 3, critical: 4 };
        return (severityScores[severity] || 2) * (confidence / 100) * 100;
    }

    prioritizeAndValidateThreats(threats) {
        // Sort by priority score (highest first)
        threats.sort((a, b) => b.priority_score - a.priority_score);

        // Add some randomization to make it feel more realistic
        threats.forEach(threat => {
            threat.last_verified_at = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Within last 30 days
            threat.discovery_date = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Within last 7 days
        });

        return threats;
    }

    // Get scan statistics
    calculateScanStats(threats) {
        const stats = {
            total: threats.length,
            high_risk: threats.filter(t => ['high', 'critical'].includes(t.severity)).length,
            medium_risk: threats.filter(t => t.severity === 'medium').length,
            low_risk: threats.filter(t => t.severity === 'low').length,
            by_category: {},
            by_removal_difficulty: {}
        };

        threats.forEach(threat => {
            stats.by_category[threat.site_category] = (stats.by_category[threat.site_category] || 0) + 1;
            stats.by_removal_difficulty[threat.removal_difficulty] = (stats.by_removal_difficulty[threat.removal_difficulty] || 0) + 1;
        });

        return stats;
    }
}

export default ThreatDetectionEngine;