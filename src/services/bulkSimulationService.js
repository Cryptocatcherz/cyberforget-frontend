import api from './apiService';
import { useSocket } from '../hooks/useSocket.js'

class BulkSimulationService {
    constructor() {
        this.isRunning = false;
        this.currentBatch = [];
        this.processedUsers = 0;
        this.totalUsers = 0;
        this.errors = [];
    }

    async startBulkSimulation() {
        if (this.isRunning) {
            console.log('[BulkSimulation] Simulation already in progress');
            return false;
        }

        try {
            this.isRunning = true;
            this.errors = [];
            this.processedUsers = 0;

            // Fetch all users
            const response = await api.get('/admin/users');
            if (!response.data?.success) {
                throw new Error('Failed to fetch users');
            }

            const users = response.data.users;
            this.totalUsers = users.length;
            console.log(`[BulkSimulation] Starting simulation for ${this.totalUsers} users`);

            // Process users in batches of 5
            const batchSize = 5;
            for (let i = 0; i < users.length; i += batchSize) {
                this.currentBatch = users.slice(i, i + batchSize);
                
                // Start simulations for current batch
                await Promise.all(
                    this.currentBatch.map(user => this.simulateForUser(user))
                );

                this.processedUsers += this.currentBatch.length;
                console.log(`[BulkSimulation] Processed ${this.processedUsers}/${this.totalUsers} users`);
            }

            console.log('[BulkSimulation] Bulk simulation completed');
            console.log('Errors:', this.errors);

            return {
                success: true,
                processedUsers: this.processedUsers,
                totalUsers: this.totalUsers,
                errors: this.errors
            };

        } catch (error) {
            console.error('[BulkSimulation] Error during bulk simulation:', error);
            this.errors.push({
                message: 'Bulk simulation failed',
                error: error.message
            });
            return {
                success: false,
                error: error.message,
                processedUsers: this.processedUsers,
                totalUsers: this.totalUsers,
                errors: this.errors
            };
        } finally {
            this.isRunning = false;
            this.currentBatch = [];
        }
    }

    async simulateForUser(user) {
        try {
            console.log(`[BulkSimulation] Starting simulation for user: ${user.id}`);
            
            // Join user's room
            await useSocket.joinRoom(user.id);
            
            // Emit simulation start event
            useSocket.emit('start_simulation', { userId: user.id });
            
            // Wait for simulation to complete or timeout after 2 minutes
            await Promise.race([
                new Promise((resolve) => {
                    const timeout = setTimeout(() => {
                        resolve({ timeout: true });
                    }, 120000); // 2 minutes timeout

                    useSocket.addListener('simulation_complete', (data) => {
                        clearTimeout(timeout);
                        resolve(data);
                    });
                }),
                new Promise((resolve) => {
                    useSocket.addListener('simulation_error', (error) => {
                        resolve({ error });
                    });
                })
            ]);

            // Leave user's room
            await useSocket.leaveRoom(user.id);

            console.log(`[BulkSimulation] Completed simulation for user: ${user.id}`);
            return true;

        } catch (error) {
            console.error(`[BulkSimulation] Error simulating for user ${user.id}:`, error);
            this.errors.push({
                userId: user.id,
                message: 'Simulation failed',
                error: error.message
            });
            return false;
        }
    }

    getProgress() {
        return {
            isRunning: this.isRunning,
            processedUsers: this.processedUsers,
            totalUsers: this.totalUsers,
            currentBatch: this.currentBatch,
            errors: this.errors
        };
    }
}

const bulkSimulationService = new BulkSimulationService();
export default bulkSimulationService; 