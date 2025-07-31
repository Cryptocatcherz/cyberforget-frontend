const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['queued', 'in_progress', 'completed', 'error', 'stopped'],
        default: 'queued'
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    startTime: {
        type: Date,
        required: true
    },
    completedTime: {
        type: Date
    },
    currentSite: {
        type: String
    },
    error: {
        type: String
    },
    results: {
        type: Map,
        of: {
            status: String,
            findings: [{
                type: String
            }]
        }
    },
    threatCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
scanSchema.index({ userId: 1, status: 1 });
scanSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Scan', scanSchema); 