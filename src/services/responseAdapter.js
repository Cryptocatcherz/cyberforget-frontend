/**
 * Response Adapter Service
 * Transforms backend responses to match frontend expectations
 */

class ResponseAdapter {
    /**
     * Standardize API response format
     */
    static standardizeResponse(response) {
        // Backend returns: { success: boolean, data: any, error?: string }
        // Frontend expects same format, so this is mostly for consistency checking
        
        if (!response || typeof response !== 'object') {
            return {
                success: false,
                error: 'Invalid response format'
            };
        }

        return {
            success: response.success || false,
            data: response.data || null,
            error: response.error || null,
            message: response.message || null
        };
    }

    /**
     * Transform dashboard stats from backend format to frontend format
     */
    static transformDashboardStats(backendData) {
        if (!backendData?.success || !backendData.data) {
            return {
                success: false,
                error: 'No dashboard data available'
            };
        }

        const { overview, threats, activity } = backendData.data;

        // Transform to frontend expected format
        const transformedData = {
            // Main stats
            sitesScanned: overview?.completedScans || 0,
            totalMatches: threats?.total || 0,
            potentialThreats: threats?.total || 0,
            profilesFound: threats?.total || 0,
            
            // Additional stats
            totalScans: overview?.totalScans || 0,
            highRiskThreats: overview?.highRiskThreats || 0,
            
            // Status indicators
            lastScanTime: activity?.recentScans?.[0]?.completedAt || null,
            isScanning: overview?.activeScans > 0 || false,
            progress: overview?.averageProgress || 0,
            
            // Breakdown data
            threatBreakdown: threats?.breakdown || {},
            recentActivity: activity?.last30Days || [],
            recentScans: activity?.recentScans || []
        };

        return {
            success: true,
            data: transformedData
        };
    }

    /**
     * Transform scan data from backend to frontend format
     */
    static transformScanData(backendData) {
        if (!backendData?.success || !backendData.data) {
            return {
                success: false,
                error: 'No scan data available'
            };
        }

        const scan = backendData.data;

        return {
            success: true,
            data: {
                id: scan.id,
                type: scan.type,
                status: scan.status,
                priority: scan.priority,
                targets: scan.targets || [],
                progress: scan.progress || {},
                
                // Timestamps
                createdAt: scan.createdAt,
                startedAt: scan.startedAt,
                completedAt: scan.completedAt,
                scheduledAt: scan.scheduledAt,
                
                // Results
                results: scan.results || [],
                totalResults: scan.results?.length || 0,
                
                // Metadata
                metadata: scan.metadata || {}
            }
        };
    }

    /**
     * Transform user data from backend to frontend format
     */
    static transformUserData(backendData) {
        if (!backendData?.success || !backendData.data) {
            return {
                success: false,
                error: 'No user data available'
            };
        }

        const user = backendData.data;

        return {
            success: true,
            data: {
                id: user.id,
                clerkId: user.clerkId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                
                // Account status
                role: user.role,
                subscriptionStatus: user.subscriptionStatus,
                isActive: user.isActive,
                emailVerified: user.emailVerified,
                
                // Timestamps
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                lastLoginAt: user.lastLoginAt,
                
                // Additional data
                preferences: user.preferences || {},
                metadata: user.metadata || {},
                stripeCustomerId: user.stripeCustomerId
            }
        };
    }

    /**
     * Transform threat/scan result data
     */
    static transformThreatData(backendData) {
        if (!backendData?.success || !backendData.data) {
            return {
                success: false,
                error: 'No threat data available'
            };
        }

        const threats = Array.isArray(backendData.data) ? backendData.data : [backendData.data];

        const transformedThreats = threats.map(threat => ({
            id: threat.id,
            scanId: threat.scanId,
            type: threat.type,
            severity: threat.severity,
            title: threat.title,
            description: threat.description,
            source: threat.source,
            sourceUrl: threat.sourceUrl,
            verified: threat.verified,
            removalStatus: threat.removalStatus,
            
            // Target information
            target: threat.target || {},
            
            // Timestamps
            discoveredAt: threat.discoveredAt,
            createdAt: threat.createdAt,
            updatedAt: threat.updatedAt,
            
            // Additional metadata
            metadata: threat.metadata || {}
        }));

        return {
            success: true,
            data: transformedThreats,
            total: transformedThreats.length
        };
    }

    /**
     * Transform subscription data
     */
    static transformSubscriptionData(backendData) {
        if (!backendData?.success || !backendData.data) {
            return {
                success: false,
                error: 'No subscription data available'
            };
        }

        const subscription = backendData.data.subscription;

        return {
            success: true,
            data: {
                id: subscription.id,
                stripeSubscriptionId: subscription.stripeSubscriptionId,
                stripeCustomerId: subscription.stripeCustomerId,
                stripePriceId: subscription.stripePriceId,
                stripeProductId: subscription.stripeProductId,
                
                status: subscription.status,
                currentPeriodStart: subscription.currentPeriodStart,
                currentPeriodEnd: subscription.currentPeriodEnd,
                cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                canceledAt: subscription.canceledAt,
                
                // Trial information
                trialStart: subscription.trialStart,
                trialEnd: subscription.trialEnd,
                
                // Computed fields
                isActive: ['active', 'trialing'].includes(subscription.status),
                isTrialing: subscription.status === 'trialing',
                daysLeft: subscription.currentPeriodEnd ? 
                    Math.ceil((new Date(subscription.currentPeriodEnd) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
                
                // Metadata
                metadata: subscription.metadata || {}
            }
        };
    }

    /**
     * Transform feature toggle data
     */
    static transformFeatureToggleData(backendData) {
        if (!backendData?.success) {
            return {
                success: false,
                error: 'No feature toggle data available'
            };
        }

        // Handle both single toggle and array of toggles
        const toggles = backendData.data;
        
        if (Array.isArray(toggles)) {
            const transformedToggles = toggles.reduce((acc, toggle) => {
                acc[toggle.name] = {
                    enabled: toggle.enabled,
                    description: toggle.description,
                    strategy: toggle.strategy,
                    environment: toggle.environment,
                    conditions: toggle.conditions || []
                };
                return acc;
            }, {});

            return {
                success: true,
                data: transformedToggles
            };
        } else {
            // Single toggle response
            return {
                success: true,
                data: {
                    enabled: toggles.enabled,
                    description: toggles.description,
                    strategy: toggles.strategy,
                    environment: toggles.environment,
                    conditions: toggles.conditions || []
                }
            };
        }
    }

    /**
     * Transform payment data
     */
    static transformPaymentData(backendData) {
        if (!backendData?.success || !backendData.data) {
            return {
                success: false,
                error: 'No payment data available'
            };
        }

        const payment = backendData.data;

        return {
            success: true,
            data: {
                id: payment.id,
                stripePaymentId: payment.stripePaymentId,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                paymentMethod: payment.paymentMethod,
                description: payment.description,
                
                // Timestamps
                createdAt: payment.createdAt,
                processedAt: payment.processedAt,
                failedAt: payment.failedAt,
                
                // Refund information
                refundedAt: payment.refundedAt,
                refundAmount: payment.refundAmount,
                
                // Computed fields
                isSuccessful: payment.status === 'SUCCEEDED',
                isFailed: payment.status === 'FAILED',
                isRefunded: !!payment.refundedAt,
                
                // Formatted amounts
                formattedAmount: this.formatCurrency(payment.amount, payment.currency),
                formattedRefundAmount: payment.refundAmount ? 
                    this.formatCurrency(payment.refundAmount, payment.currency) : null,
                
                // Metadata
                metadata: payment.metadata || {}
            }
        };
    }

    /**
     * Helper method to format currency
     */
    static formatCurrency(amount, currency = 'usd') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount / 100); // Convert from cents
    }

    /**
     * Transform error responses
     */
    static transformError(error) {
        if (error?.response?.data) {
            return {
                success: false,
                error: error.response.data.error || error.response.data.message || 'An error occurred',
                statusCode: error.response.status,
                details: error.response.data.details || null
            };
        }

        return {
            success: false,
            error: error.message || 'An unexpected error occurred',
            statusCode: null,
            details: null
        };
    }

    /**
     * Transform paginated responses
     */
    static transformPaginatedResponse(backendData) {
        if (!backendData?.success || !backendData.data) {
            return {
                success: false,
                error: 'No paginated data available'
            };
        }

        const { items, pagination } = backendData.data;

        return {
            success: true,
            data: items || [],
            pagination: {
                page: pagination?.page || 1,
                limit: pagination?.limit || 10,
                total: pagination?.total || 0,
                totalPages: pagination?.totalPages || 1,
                hasNext: pagination?.hasNext || false,
                hasPrev: pagination?.hasPrev || false
            }
        };
    }
}

export default ResponseAdapter;