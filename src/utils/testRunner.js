/**
 * Test Runner Utility
 * Simple test runner for integration tests
 */

import integrationTestSuite from '../tests/integrationTest';

class TestRunner {
    static async runIntegrationTests() {
        console.log('🧪 Starting CyberForget Integration Tests...');
        console.log('================================================');

        try {
            const results = await integrationTestSuite.runAllTests();
            
            console.log('\n📊 Test Results Summary');
            console.log('========================');
            console.log(`Total Tests: ${results.summary.total}`);
            console.log(`Passed: ${results.summary.passed} ✅`);
            console.log(`Failed: ${results.summary.failed} ❌`);
            console.log(`Success Rate: ${results.summary.successRate}%`);
            console.log(`Status: ${results.summary.status.toUpperCase()}`);

            if (results.summary.failed > 0) {
                console.log('\n❌ Failed Tests:');
                results.results
                    .filter(r => !r.passed)
                    .forEach(r => {
                        console.log(`   • ${r.test}: ${r.description}`);
                    });
            }

            console.log('\n📋 Detailed Results:');
            results.results.forEach(r => {
                const status = r.passed ? '✅' : '❌';
                console.log(`   ${status} ${r.test}: ${r.description}`);
            });

            return results;
        } catch (error) {
            console.error('❌ Integration tests failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async runQuickHealthCheck() {
        console.log('🏥 Running Quick Health Check...');
        console.log('==================================');

        try {
            const health = await integrationTestSuite.quickHealthCheck();
            
            console.log(`Status: ${health.status.toUpperCase()}`);
            console.log(`Score: ${health.score}`);
            console.log('\nChecks:');
            
            health.checks.forEach(check => {
                const status = check.status ? '✅' : '❌';
                const details = check.details ? ` (${check.details})` : '';
                console.log(`   ${status} ${check.name} [${check.type}]${details}`);
            });

            return health;
        } catch (error) {
            console.error('❌ Health check failed:', error);
            return {
                status: 'error',
                error: error.message
            };
        }
    }

    // Test individual components
    static async testAuthentication() {
        console.log('🔐 Testing Authentication...');
        
        const clerkAuthService = (await import('../services/clerkAuthService')).default;
        
        try {
            // Test basic functionality
            const isAuth = clerkAuthService.isAuthenticated();
            const headers = await clerkAuthService.getAuthHeaders();
            
            console.log(`   Authenticated: ${isAuth}`);
            console.log(`   Headers available: ${!!headers}`);
            
            return {
                success: true,
                authenticated: isAuth,
                headersAvailable: !!headers
            };
        } catch (error) {
            console.error('   ❌ Authentication test failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async testApiConnectivity() {
        console.log('🌐 Testing API Connectivity...');
        
        const dataService = (await import('../services/dataService')).default;
        
        try {
            // Test health endpoint (no auth required)
            const health = await dataService.getSystemHealth();
            console.log(`   Health endpoint: ${health.success ? '✅' : '❌'}`);
            
            // Test feature toggles (basic endpoint)
            const toggles = await dataService.getFeatureToggles();
            console.log(`   Feature toggles: ${toggles.success ? '✅' : '❌'}`);
            
            return {
                success: true,
                health: health.success,
                featureToggles: toggles.success
            };
        } catch (error) {
            console.error('   ❌ API connectivity test failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async testDataTransformation() {
        console.log('🔄 Testing Data Transformation...');
        
        const ResponseAdapter = (await import('../services/responseAdapter')).default;
        
        try {
            // Test dashboard transformation
            const mockDashboard = {
                success: true,
                data: {
                    overview: { totalScans: 5, completedScans: 3 },
                    threats: { total: 2 },
                    activity: { last30Days: [], recentScans: [] }
                }
            };
            
            const transformed = ResponseAdapter.transformDashboardStats(mockDashboard);
            console.log(`   Dashboard transform: ${transformed.success ? '✅' : '❌'}`);
            
            // Test error transformation
            const mockError = {
                response: { status: 404, data: { error: 'Not found' } }
            };
            
            const errorTransformed = ResponseAdapter.transformError(mockError);
            console.log(`   Error transform: ${!errorTransformed.success ? '✅' : '❌'}`);
            
            return {
                success: true,
                dashboardTransform: transformed.success,
                errorTransform: !errorTransformed.success
            };
        } catch (error) {
            console.error('   ❌ Data transformation test failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Run all component tests
    static async runComponentTests() {
        console.log('🧩 Running Component Tests...');
        console.log('==============================');

        const results = {
            authentication: await this.testAuthentication(),
            apiConnectivity: await this.testApiConnectivity(),
            dataTransformation: await this.testDataTransformation()
        };

        const allPassed = Object.values(results).every(r => r.success);
        
        console.log(`\nComponent Tests: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
        
        return {
            success: allPassed,
            results
        };
    }

    // Validate configuration
    static async validateConfiguration() {
        console.log('⚙️ Validating Configuration...');
        console.log('===============================');

        const issues = [];

        try {
            // Check endpoints configuration
            const { ENDPOINTS } = await import('../config/endpoints');
            
            if (!ENDPOINTS.AUTH.ME) {
                issues.push('Missing AUTH.ME endpoint');
            }
            
            if (!ENDPOINTS.DASHBOARD.STATS) {
                issues.push('Missing DASHBOARD.STATS endpoint');
            }
            
            if (!ENDPOINTS.SCANS.CREATE) {
                issues.push('Missing SCANS.CREATE endpoint');
            }
            
            console.log(`   Endpoints: ${issues.length === 0 ? '✅' : '❌'}`);
            
            // Check environment configuration
            const { environment } = await import('../config/environment');
            
            if (!environment.api.baseUrl) {
                issues.push('Missing API base URL');
            }
            
            console.log(`   Environment: ${environment.api.baseUrl ? '✅' : '❌'}`);
            
            // Check service availability
            const dataService = (await import('../services/dataService')).default;
            const clerkAuthService = (await import('../services/clerkAuthService')).default;
            
            console.log(`   DataService: ${dataService ? '✅' : '❌'}`);
            console.log(`   ClerkAuthService: ${clerkAuthService ? '✅' : '❌'}`);
            
            if (issues.length > 0) {
                console.log('\n❌ Configuration Issues:');
                issues.forEach(issue => console.log(`   • ${issue}`));
            }
            
            return {
                success: issues.length === 0,
                issues
            };
        } catch (error) {
            console.error('   ❌ Configuration validation failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Generate integration report
    static async generateReport() {
        console.log('📄 Generating Integration Report...');
        console.log('====================================');

        const report = {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            tests: {},
            summary: {
                status: 'unknown',
                issues: 0,
                recommendations: []
            }
        };

        try {
            // Run all tests
            report.tests.configuration = await this.validateConfiguration();
            report.tests.components = await this.runComponentTests();
            report.tests.health = await this.runQuickHealthCheck();
            report.tests.integration = await this.runIntegrationTests();

            // Calculate overall status
            const allTests = Object.values(report.tests);
            const passedTests = allTests.filter(t => t.success).length;
            const totalTests = allTests.length;
            
            report.summary.status = passedTests === totalTests ? 'healthy' : 
                                   passedTests >= totalTests * 0.8 ? 'warning' : 'critical';
            
            report.summary.score = `${passedTests}/${totalTests}`;
            
            // Generate recommendations
            if (!report.tests.configuration.success) {
                report.summary.recommendations.push('Fix configuration issues');
            }
            
            if (!report.tests.components.success) {
                report.summary.recommendations.push('Fix component integration issues');
            }
            
            if (report.tests.health.status !== 'healthy') {
                report.summary.recommendations.push('Address API connectivity issues');
            }

            console.log('\n📋 Final Report:');
            console.log(`   Status: ${report.summary.status.toUpperCase()}`);
            console.log(`   Score: ${report.summary.score}`);
            
            if (report.summary.recommendations.length > 0) {
                console.log('   Recommendations:');
                report.summary.recommendations.forEach(rec => {
                    console.log(`     • ${rec}`);
                });
            }

            return report;
        } catch (error) {
            console.error('❌ Report generation failed:', error);
            return {
                ...report,
                error: error.message,
                summary: { status: 'error', issues: 1 }
            };
        }
    }
}

export default TestRunner;