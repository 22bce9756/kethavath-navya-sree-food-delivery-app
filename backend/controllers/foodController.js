import foodModel from "../models/foodModel.js";
import fs from "fs";

// Helper to get base URL dynamically
const getBaseUrl = (req) => {
  return process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
};

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    const baseUrl = getBaseUrl(req);

    const updatedFoods = foods.map(food => ({
      ...food._doc,
      image: food.image.startsWith("http")
        ? food.image
        : `${baseUrl}/images/${food.image}`
    }));

    res.json({ success: true, data: updatedFoods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// add food
const addFood = async (req, res) => {
  try {
    let image_filename = req.file.filename;
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename
    });

    await food.save();

    const baseUrl = getBaseUrl(req);

    res.json({
      success: true,
      message: "Food Added",
      data: {
        ...food._doc,
        image: `${baseUrl}/images/${image_filename}`
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    // remove image file if it exists
    const imagePath = `uploads/${food.image}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await foodModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export { listFood, addFood, removeFood };
