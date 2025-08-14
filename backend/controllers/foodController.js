import foodModel from "../models/foodModel.js";
import mongoose from "mongoose";

// all food list
const listFood = async (req, res) => {
    try {
        let foods = await foodModel.find({});

        // Map each food to include the full image URL
        foods = foods.map(food => ({
            ...food._doc,
            image: `${process.env.BASE_URL}/images/${food.image}`
        }));

        res.json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

// add food
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "Image is required" });
        }

        // Save file to GridFS
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "images"
        });

        await new Promise((resolve, reject) => {
            bucket.openUploadStream(req.file.filename)
                .end(req.file.buffer, (err) => err ? reject(err) : resolve());
        });

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: `${process.env.BASE_URL}/api/food/image/${req.file.filename}`
        });

        await food.save();
        res.json({ success: true, message: "Food Added", food });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

// delete food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) return res.json({ success: false, message: "Food not found" });

        // Optionally: also delete from GridFS here
        await foodModel.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

export { listFood, addFood, removeFood };
