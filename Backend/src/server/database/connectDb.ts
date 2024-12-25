import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();


const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
    }
};

export default connectDB;
