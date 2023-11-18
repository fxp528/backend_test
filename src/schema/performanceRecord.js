import mongoose from 'mongoose';

const performanceRecordSchema = mongoose.Schema({
    date: Date,
    dept: String,
    user: String,
    reason: String,
    type: {
        type: String,
        enum: ['優蹟', '劣蹟'],
    },
    count: Number,
});
const PerformanceRecord = mongoose.model(
    'PerformanceRecord',
    performanceRecordSchema
);

export {PerformanceRecord}