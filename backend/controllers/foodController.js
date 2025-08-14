import foodModel from "../models/foodModel.js";
// import cloudinary from "../config/cloudinary.js"; // Uncomment if deleting from Cloudinary

// Get all foods
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods }); // Cloudinary URLs already full
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching foods" });
    }
};

// Add new food
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const food = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.file.path,          // Cloudinary secure URL
            imagePublicId: req.file.filename // Optional: public_id for deletion
        });

        res.json({ success: true, message: "Food Added", food });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error adding food" });
    }
};

// Remove food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        // Optional Cloudinary delete
        /*
        if (food.imagePublicId) {
            await cloudinary.uploader.destroy(food.imagePublicId);
        }
        */

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error removing food" });
    }
};

export { listFood, addFood, removeFood };
