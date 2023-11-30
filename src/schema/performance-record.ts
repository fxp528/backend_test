import mongoose from 'mongoose';

const performanceRecordSchema = new mongoose.Schema({
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

if (!process.env.MONGO_COLLECTION) {
    throw new Error('MONGO_COLLECTION is not defined in the environment variables.');
}

const PerformanceRecord = mongoose.model(
    process.env.MONGO_COLLECTION,
    performanceRecordSchema
);

export { PerformanceRecord }