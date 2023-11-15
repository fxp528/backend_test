import mongoose from 'mongoose';

export async function connectDB(uri, dbName) {
  try {
    console.log(`Connecting to MongoDB... ${uri}/${dbName}`);
    const instance = await mongoose.connect(`${uri}/${dbName}`);
    console.log(`Connected to MongoDB... ${uri}/${dbName}`);
    return instance.connection;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

