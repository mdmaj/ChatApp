import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

export const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const uri = process.env.MONGODB_URI;

        cached.promise = mongoose.connect(uri, {
            dbName: "ChatApp",
        }).then((mongoose) => {
            console.log("MongoDB connected");
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

global.mongoose = cached;