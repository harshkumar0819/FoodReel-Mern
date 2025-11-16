const express = require('express');
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/', authMiddleware.authFoodPartnerMiddleware, upload.single("video"), foodController.createFood);

router.get("/",  foodController.getFoodItems);


router.post('/like', authMiddleware.authUserMiddleware, foodController.likeFoodItem);


router.post('/save', authMiddleware.authUserMiddleware, foodController.saveFoodItem);

router.get('/saved', authMiddleware.authUserMiddleware, foodController.getSavedFoodItems);

module.exports = router;
