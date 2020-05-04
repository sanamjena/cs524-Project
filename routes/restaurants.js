const express = require("express");
// const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const restaurantData = require("../data/restaurants");
const commentsData = require("../data/comments");
// const restaurants = mongoCollections.restaurants;
const userData = require("../data/users");


router.get("/:id", async (req, res) => {
    try {
        restaurantId = req.params.id;
        restaurant = await restaurantData.getRestaurantById(restaurantId);
        sendData = {}
        comments = await commentsData.getCommentsByRestaurant(restaurantId);
        showCommentSection = true;
        var userId = 'ab';
        if(req.user) {
            userId = req.user._id;
            userJSON = await userData.getUserById(userId);
            if(userJSON.hasOwnProperty("wishlist")) {
                wishlist = userJSON.wishlist;
                if(wishlist.includes(restaurantId)) {
                    sendData.wishlist = 'added-to-wishlist';
                }
            }
            if(userJSON.hasOwnProperty("votes")) {
                votes = userJSON.votes;
                if(votes.includes(restaurantId)) {
                    sendData.vote = 'upvoted';
                }
            }
        }
        for(let i = 0; i< comments.length; i++){
            let user = await userData.getUserById(comments[i].userid)
            if(comments[i].userid === userId) {
                showCommentSection = false;
            }
            comments[i].username = user.firstname;
        }

        sendData.restaurant = restaurant;
        sendData.comments = comments;
        sendData.enablecomment = showCommentSection;

        res.render('resturants/restaurantDescriptionPage', sendData);
    } catch (error) {
        res.status(404).json(error);
    }
});

router.post('/addrestaurant', async function (req, res, next) {
    try {
        const restaurantInfo = req.body;
        const restaurant = await restaurantData.addRestaurant(restaurantInfo);
        res.json(restaurant);
    } catch (error) {

    }

});

router.post('/deleterestaurant', async function (req, res, next) {
        const restaurantInfo = req.body;
        const restaurantId = restaurantInfo.restaurantid;
        userCollection = await userData.getAllUsers();
        if(userCollection) {
            for(var i=0; i<userCollection.length; i++) {
                userId = userCollection[i]._id;
                deleteFromWishlist = await userData.removeFromWishlist(restaurantInfo, userId);
                delelteVotes = await userData.removeVoteForRestaurant(restaurantId, userId);
            }
        }
        if(await restaurantData.deleteRestraunt(restaurantId)) {
            restaurantInfo.delete = true;
            res.json(restaurantInfo);
        } else {
            restaurantInfo.delete = false;
            res.json(restaurantInfo)
        }
});


router.post('/vote', async function (req, res, next) {
    if (req.isAuthenticated()) {
        data = req.body;
        userId = req.user._id;
        data.validation = true;
        console.log("Data passed to the route: " + JSON.stringify(data));
        vote = await  restaurantData.voteRestaurant(data, userId);
        res.send(vote);
    } else {
      const json = {
        "validation": false,
        "message": "Please login to your account to comment"
      }
      res.send(json);
    }
    // restaurant = await restaurantData.getRestaurantById(req.body.restaurantid);
    // if(req.body.vote) {
    //     restaurant.score += 1;
    // } else {
    //     restaurant.score -= 1;
    // }
    // const restaurantCollection = await restaurants();
    // let updatecommand =
    // {
    //     $set: restaurant
    // };
    // const query =
    // {
    //     _id: req.body.restaurantid
    // };
    // await restaurantCollection.updateOne(query, updatecommand);
    // return await restaurantData.getRestaurantById(req.body.restaurantid);

});


module.exports = router;