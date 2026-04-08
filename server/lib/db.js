import mongoose from "mongoose";

// Function to connect to the mongodb database
export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err.message || err);
        });

        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not set in environment');
        }

        await mongoose.connect(uri, {
            dbName: 'ChatApp',
        });
    } catch (error) {
        console.log(error);
    }
}