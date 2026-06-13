import mongoose from "mongoose";

const connectDb = async () => {
  const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MongoDB connection string is missing. Set MONGODB_URL or MONGODB_URI.");
  }

  mongoose.set("bufferCommands", false);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection error:", error.message);
    throw error;
  }
};

export default connectDb;
