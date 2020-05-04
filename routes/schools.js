const express = require("express");
const router = express.Router();
const schoolData = require("../data/schools");
const restaurantData = require("../data/restaurants");


router.get("/:id",async (req,res) => {
    try {
        schoolId = req.params.id;
        const school = await schoolData.getSchoolById(schoolId);
        const restaurantCollection = await restaurantData.getRestaurantBySchoolId(schoolId);
        restaurantCollection.sort(function(a, b){
            return b.score-a.score
        });
        console.log("Restaurant list is :: ");
        console.log(restaurantCollection);
        res.render('resturants/resturantList', {
            restaurants: restaurantCollection,
            school: school
        });
        // res.json(restaurantCollection);
    } catch (error) {
        res.status(404).json(error);
    }
});

router.post('/addschool', async function(req, res, next) {
    try {
        const schoolInfo = req.body;
        const school = await schoolData.addSchool(schoolInfo);
        res.json(school);
    } catch (error) {
        
    }

});


module.exports = router;