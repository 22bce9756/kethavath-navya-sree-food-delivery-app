import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "food-delivery",         // any folder name you like
    allowed_formats: ["jpg","png","jpeg","webp"],
    // optional: public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

export const uploadToCloudinary = multer({ storage });
