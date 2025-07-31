import React, { useState } from 'react';
import bulkSimulationService from '../../services/bulkSimulationService';

const BulkSimulationControl = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);

    const handleStartSimulation = async () => {
        try {
            setIsRunning(true);
            setError(null);

            const result = await bulkSimulationService.startBulkSimulation();
            
            if (result.success) {
                setProgress({
                    processedUsers: result.processedUsers,
                    totalUsers: result.totalUsers,
                    errors: result.errors
                });
            } else {
                setError(result.error || 'Failed to start bulk simulation');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsRunning(false);
        }
    };

    const getProgressPercentage = () => {
        if (!progress?.totalUsers) return 0;
        return Math.round((progress.processedUsers / progress.totalUsers) * 100);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Bulk Simulation Control</h2>
            
            <div className="space-y-4">
                <button
                    onClick={handleStartSimulation}
                    disabled={isRunning}
                    className={`px-4 py-2 rounded ${
                        isRunning 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600'
                    } text-white font-medium`}
                >
                    {isRunning ? 'Simulation in Progress...' : 'Start Bulk Simulation'}
                </button>

                {isRunning && (
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${getProgressPercentage()}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Processing users... {progress?.processedUsers || 0}/{progress?.totalUsers || 0}
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {progress && !isRunning && (
                    <div className="mt-4">
                        <h3 className="font-medium">Simulation Results</h3>
                        <p>Processed Users: {progress.processedUsers}/{progress.totalUsers}</p>
                        {progress.errors.length > 0 && (
                            <div className="mt-2">
                                <h4 className="font-medium text-red-600">Errors ({progress.errors.length})</h4>
                                <ul className="list-disc pl-5 mt-1">
                                    {progress.errors.map((error, index) => (
                                        <li key={index} className="text-sm text-red-600">
                                            {error.userId ? `User ${error.userId}: ` : ''}{error.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkSimulationControl; 