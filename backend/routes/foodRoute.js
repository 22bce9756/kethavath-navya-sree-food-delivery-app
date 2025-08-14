import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import mongoose from "mongoose";

const foodRouter = express.Router();

// Storage engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage });

// Routes
foodRouter.get("/list", listFood);

foodRouter.post("/add", upload.single("image"), addFood);

foodRouter.post("/remove", removeFood);

// Serve image by filename from GridFS
foodRouter.get("/image/:filename", async (req, res) => {
    try {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "images"
        });

        bucket.openDownloadStreamByName(req.params.filename)
            .pipe(res)
            .on("error", () => res.status(404).send("Image not found"));
    } catch (err) {
        res.status(500).send(err.message);
    }
});


export default foodRouter;
