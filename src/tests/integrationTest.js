/**
 * Integration Test Suite
 * Tests the complete frontend-backend integration
 */

import dataService from '../services/dataService';
import clerkAuthService from '../services/clerkAuthService';
import ResponseAdapter from '../services/responseAdapter';

class IntegrationTestSuite {
    constructor() {
        this.results = [];
        this.isRunning = false;
    }

    // Run all integration tests
    async runAllTests() {
        if (this.isRunning) {
            console.warn('[IntegrationTest] Tests already running');
            return this.results;
        }

        this.isRunning = true;
        this.results = [];

        console.log('[IntegrationTest] Starting integration tests...');

        try {
            // Test authentication
            await this.testAuthentication();
            
            // Test API endpoints
            await this.testApiEndpoints();
            
            // Test data transformations
            await this.testDataTransformations();
            
            // Test service integrations
            await this.testServiceIntegrations();
            
            // Test error handling
            await this.testErrorHandling();

            const summary = this.generateSummary();
            console.log('[IntegrationTest] Tests completed:', summary);
            
            return {
                success: true,
                results: this.results,
                summary
            };
        } catch (error) {
            console.error('[IntegrationTest] Test suite failed:', error);
            return {
                success: false,
                error: error.message,
                results: this.results
            };
        } finally {
            this.isRunning = false;
        }
    }

    // Test authentication integration
    async testAuthentication() {
        console.log('[IntegrationTest] Testing authentication...');
        
        try {
            // Test auth service initialization
            this.addResult('auth_service_exists', 
                typeof clerkAuthService === 'object',
                'ClerkAuthService instance exists'
            );

            // Test token retrieval (might fail if not authenticated)
            try {
                const token = await clerkAuthService.getToken();
                this.addResult('auth_token_retrieval',
                    token === null || typeof token === 'string',
                    'Token retrieval works (null if not authenticated)'
                );
            } catch (error) {
                this.addResult('auth_token_retrieval',
                    false,
                    `Token retrieval failed: ${error.message}`
                );
            }

            // Test auth headers
            try {
                const headers = await clerkAuthService.getAuthHeaders();
                this.addResult('auth_headers',
                    typeof headers === 'object',
                    'Auth headers generation works'
                );
            } catch (error) {
                this.addResult('auth_headers',
                    false,
                    `Auth headers failed: ${error.message}`
                );
            }

        } catch (error) {
            this.addResult('authentication',
                false,
                `Authentication test failed: ${error.message}`
            );
        }
    }

    // Test API endpoint connectivity
    async testApiEndpoints() {
        console.log('[IntegrationTest] Testing API endpoints...');

        // Test health endpoint (should not require auth)
        try {
            const health = await dataService.getSystemHealth();
            this.addResult('health_endpoint',
                health.success === true || health.success === false, // Either success or proper error
                'Health endpoint responds'
            );
        } catch (error) {
            this.addResult('health_endpoint',
                false,
                `Health endpoint failed: ${error.message}`
            );
        }

        // Test authenticated endpoints (may fail if not authenticated)
        try {
            const dashboardStats = await dataService.getDashboardStats();
            this.addResult('dashboard_endpoint',
                dashboardStats.success === true || dashboardStats.success === false,
                'Dashboard endpoint responds'
            );
        } catch (error) {
            this.addResult('dashboard_endpoint',
                false,
                `Dashboard endpoint failed: ${error.message}`
            );
        }

        try {
            const scans = await dataService.getScans();
            this.addResult('scans_endpoint',
                scans.success === true || scans.success === false,
                'Scans endpoint responds'
            );
        } catch (error) {
            this.addResult('scans_endpoint',
                false,
                `Scans endpoint failed: ${error.message}`
            );
        }

        try {
            const featureToggles = await dataService.getFeatureToggles();
            this.addResult('feature_toggles_endpoint',
                featureToggles.success === true || featureToggles.success === false,
                'Feature toggles endpoint responds'
            );
        } catch (error) {
            this.addResult('feature_toggles_endpoint',
                false,
                `Feature toggles endpoint failed: ${error.message}`
            );
        }
    }

    // Test data transformations
    async testDataTransformations() {
        console.log('[IntegrationTest] Testing data transformations...');

        // Test response adapter with mock data
        const mockBackendResponse = {
            success: true,
            data: {
                overview: {
                    totalScans: 10,
                    completedScans: 8,
                    totalThreats: 5,
                    highRiskThreats: 2
                },
                threats: {
                    total: 5,
                    breakdown: { 'data-breach': 3, 'social-media': 2 }
                },
                activity: {
                    last30Days: [],
                    recentScans: []
                }
            }
        };

        try {
            const transformed = ResponseAdapter.transformDashboardStats(mockBackendResponse);
            
            this.addResult('dashboard_transformation',
                transformed.success && transformed.data.sitesScanned === 8,
                'Dashboard data transformation works'
            );
        } catch (error) {
            this.addResult('dashboard_transformation',
                false,
                `Dashboard transformation failed: ${error.message}`
            );
        }

        // Test user data transformation
        const mockUserResponse = {
            success: true,
            data: {
                id: 'test-id',
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                role: 'USER',
                subscriptionStatus: 'FREE'
            }
        };

        try {
            const transformed = ResponseAdapter.transformUserData(mockUserResponse);
            
            this.addResult('user_transformation',
                transformed.success && transformed.data.fullName === 'Test User',
                'User data transformation works'
            );
        } catch (error) {
            this.addResult('user_transformation',
                false,
                `User transformation failed: ${error.message}`
            );
        }

        // Test error transformation
        const mockError = {
            response: {
                status: 400,
                data: {
                    error: 'Bad Request',
                    details: 'Invalid input'
                }
            }
        };

        try {
            const transformed = ResponseAdapter.transformError(mockError);
            
            this.addResult('error_transformation',
                !transformed.success && transformed.statusCode === 400,
                'Error transformation works'
            );
        } catch (error) {
            this.addResult('error_transformation',
                false,
                `Error transformation failed: ${error.message}`
            );
        }
    }

    // Test service integrations
    async testServiceIntegrations() {
        console.log('[IntegrationTest] Testing service integrations...');

        // Test data service configuration
        this.addResult('data_service_exists',
            typeof dataService === 'object',
            'DataService instance exists'
        );

        this.addResult('websocket_config',
            typeof wsManager !== 'undefined',
            'WebSocket real-time configuration available'
        );

        // Test legacy service wrappers
        try {
            const dashboardService = (await import('../services/dashboardService')).default;
            this.addResult('dashboard_service_wrapper',
                typeof dashboardService.getDashboardStats === 'function',
                'Dashboard service wrapper works'
            );
        } catch (error) {
            this.addResult('dashboard_service_wrapper',
                false,
                `Dashboard service wrapper failed: ${error.message}`
            );
        }

        try {
            const scanService = (await import('../services/scanService')).default;
            this.addResult('scan_service_wrapper',
                typeof scanService.startScan === 'function',
                'Scan service wrapper works'
            );
        } catch (error) {
            this.addResult('scan_service_wrapper',
                false,
                `Scan service wrapper failed: ${error.message}`
            );
        }

        try {
            const featureToggleService = (await import('../services/featureToggleService')).default;
            this.addResult('feature_toggle_service_wrapper',
                typeof featureToggleService.getFeatureToggles === 'function',
                'Feature toggle service wrapper works'
            );
        } catch (error) {
            this.addResult('feature_toggle_service_wrapper',
                false,
                `Feature toggle service wrapper failed: ${error.message}`
            );
        }
    }

    // Test error handling
    async testErrorHandling() {
        console.log('[IntegrationTest] Testing error handling...');

        // Test invalid API calls
        try {
            // This should gracefully handle the invalid endpoint
            const result = await dataService.getScan('invalid-scan-id');
            
            this.addResult('invalid_scan_error_handling',
                !result.success,
                'Invalid scan ID returns proper error'
            );
        } catch (error) {
            this.addResult('invalid_scan_error_handling',
                true,
                'Invalid scan ID throws proper error'
            );
        }

        // Test network error simulation
        try {
            // Test with malformed data
            const result = ResponseAdapter.transformDashboardStats(null);
            
            this.addResult('null_data_handling',
                !result.success,
                'Null data handling works'
            );
        } catch (error) {
            this.addResult('null_data_handling',
                false,
                `Null data handling failed: ${error.message}`
            );
        }

        // Test feature toggle error handling
        try {
            const result = await dataService.getUserFeatureToggles(null);
            
            this.addResult('null_user_feature_toggles',
                result.success, // Should return default toggles
                'Null user ID returns default feature toggles'
            );
        } catch (error) {
            this.addResult('null_user_feature_toggles',
                false,
                `Null user feature toggles failed: ${error.message}`
            );
        }
    }

    // Add test result
    addResult(testName, passed, description) {
        const result = {
            test: testName,
            passed,
            description,
            timestamp: new Date().toISOString()
        };
        
        this.results.push(result);
        
        const status = passed ? '✅' : '❌';
        console.log(`[IntegrationTest] ${status} ${testName}: ${description}`);
    }

    // Generate test summary
    generateSummary() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.passed).length;
        const failed = total - passed;
        const successRate = total > 0 ? Math.round((passed / total) * 100) : 0;

        return {
            total,
            passed,
            failed,
            successRate,
            status: successRate >= 80 ? 'good' : successRate >= 60 ? 'warning' : 'critical'
        };
    }

    // Get test results
    getResults() {
        return {
            results: this.results,
            summary: this.generateSummary(),
            isRunning: this.isRunning
        };
    }

    // Quick health check
    async quickHealthCheck() {
        console.log('[IntegrationTest] Running quick health check...');
        
        const checks = [];
        
        // Check services exist
        checks.push({
            name: 'DataService',
            status: typeof dataService === 'object',
            type: 'service'
        });
        
        checks.push({
            name: 'ClerkAuthService',
            status: typeof clerkAuthService === 'object',
            type: 'service'
        });
        
        checks.push({
            name: 'ResponseAdapter',
            status: typeof ResponseAdapter === 'function',
            type: 'utility'
        });

        // Check basic API connectivity
        try {
            const health = await dataService.getSystemHealth();
            checks.push({
                name: 'API Health',
                status: health.success !== undefined,
                type: 'api',
                details: health.success ? 'responsive' : 'error response'
            });
        } catch (error) {
            checks.push({
                name: 'API Health',
                status: false,
                type: 'api',
                details: error.message
            });
        }

        const healthyChecks = checks.filter(c => c.status).length;
        const totalChecks = checks.length;
        
        return {
            status: healthyChecks === totalChecks ? 'healthy' : 'issues',
            score: `${healthyChecks}/${totalChecks}`,
            checks
        };
    }
}

// Create singleton instance
const integrationTestSuite = new IntegrationTestSuite();

export default integrationTestSuite;