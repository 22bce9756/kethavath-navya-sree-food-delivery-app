import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


console.log("Connected to MongoDB");

// Set up GridFS bucket
const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
  bucketName: "images"
});

// Path to your uploads folder
const uploadsFolder = path.join(process.cwd(), "uploads");

// Get all files in uploads folder
const files = fs.readdirSync(uploadsFolder);

for (const file of files) {
  console.log(`Uploading ${file}...`);
  await new Promise((resolve, reject) => {
    fs.createReadStream(path.join(uploadsFolder, file))
      .pipe(bucket.openUploadStream(file))
      .on("error", reject)
      .on("finish", resolve);
  });
}

console.log("All images uploaded to MongoDB!");
process.exit();
