const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
const { v4: uuid } = require('uuid');
const { get } = require('mongoose');

async function createFood(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id
    });

    res.status(201).json({
      message: "Food created successfully",
      food: foodItem
    });
  } catch (err) {
    console.error('createFood error:', err);
    res.status(500).json({ message: "Failed to create food item", error: err.message });
  }
}

async function getFoodItems(req, res) {
  try {
    const foodItems = await foodModel.find({});
    res.status(200).json({
      message: "Food items fetched successfully",
      foodItems
    });
  } catch (err) {
    console.error('getFoodItems error:', err);
    res.status(500).json({ message: "Failed to fetch food items", error: err.message });
  }
}

async function likeFoodItem(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    if (!user || !user._id) {
      return res.status(401).json({ message: "Please login first" });
    }
    if (!foodId) {
      return res.status(400).json({ message: "foodId is required" });
    }

    const isAlreadyLiked = await likeModel.findOne({
      food: foodId,
      user: user._id
    });

    if (isAlreadyLiked) {
      await likeModel.deleteOne({ food: foodId, user: user._id });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { likesCount: -1 } });

      const updated = await foodModel.findById(foodId).lean();
      return res.status(200).json({
        message: "Food item unliked successfully",
        liked: false,
        likesCount: updated ? updated.likesCount : 0
      });
    }

    const like = await likeModel.create({
      user: user._id,
      food: foodId
    });

    await foodModel.findByIdAndUpdate(foodId, { $inc: { likesCount: 1 } });

    const updated = await foodModel.findById(foodId).lean();

    res.status(201).json({
      message: "Food item liked successfully",
      liked: true,
      like,
      likesCount: updated ? updated.likesCount : 0
    });
  } catch (err) {
    console.error('likeFoodItem error:', err);
    res.status(500).json({ message: "Failed to like/unlike item", error: err.message });
  }
}

async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    if (!user || !user._id) {
      return res.status(401).json({ message: "Please login first" });
    }
    if (!foodId) return res.status(400).json({ message: 'foodId required' });

    const isAlreadySaved = await saveModel.findOne({
      food: foodId,
      user: user._id
    });

    if (isAlreadySaved) {
      await saveModel.deleteOne({ food: foodId, user: user._id });

      const updated = await foodModel.findByIdAndUpdate(
        foodId,
        { $inc: { savesCount: -1 } },
        { new: true, lean: true }
      );

      return res.status(200).json({
        message: "Food item unsaved successfully",
        saved: false,
        savesCount: updated ? Math.max(0, updated.savesCount || 0) : 0
      });
    }

    const save = await saveModel.create({ user: user._id, food: foodId });

    const updated = await foodModel.findByIdAndUpdate(
      foodId,
      { $inc: { savesCount: 1 } },
      { new: true, lean: true }
    );

    return res.status(201).json({
      message: "Food item saved successfully",
      save,
      saved: true,
      savesCount: updated ? updated.savesCount : 0
    });
  } catch (err) {
    console.error('saveFood error:', err);
    res.status(500).json({ message: "Failed to save/unsave item", error: err.message });
  }
}

async function getSavedFood(req, res) {
    const user = req.user;

    const savedFood = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFood || savedFood.length === 0) {
        return res.status(404).json({
            message: "No saved food items found"
        });
    }

    res.status(200).json({
        message: "Saved food items fetched successfully",
        savedFood
    });
}

module.exports = {
  createFood,
  getFoodItems,
  likeFoodItem,
  saveFoodItem: saveFood,
  getSavedFoodItems: getSavedFood
};
