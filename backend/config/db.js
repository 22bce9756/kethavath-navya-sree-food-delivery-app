import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = (process.env.MONGO_URI || "").trim();
  if (!uri) {
    console.error("❌ MONGO_URI is missing. Check your .env file.");
    process.exit(1);
  }

  // Mask credentials in logs
  const safe = uri.replace(/\/\/(.*?):(.*?)@/, "//<user>:<password>@");
  console.log("Connecting to MongoDB:", safe);

  try {
    await mongoose.connect(uri); // no need for deprecated options
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
