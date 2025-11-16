const requireFoodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');


async  function getFoodPartnerById(req,res){
    const foodPartnerId = req.params.id;

    const foodPartner = await requireFoodPartnerModel.findById(foodPartnerId);
    const foodItems = await foodModel.find({foodPartner: foodPartnerId});

    if(!foodPartner){
        return res.status(404).json({
            message:"Food Partner not found"
        })
    }

    res.status(200).json({
    message:"Food Partner fetched successfully",
    foodPartner:{
        ...foodPartner.toObject(),
        foodItems:foodItems
    }
});
}


module.exports = {
    getFoodPartnerById
}