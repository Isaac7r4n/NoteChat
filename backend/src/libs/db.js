import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('Sucessfully connected to database');
    } catch (error) {
        console.log('Error when connecting to database:', error);
        process.exit(1);
    }
};