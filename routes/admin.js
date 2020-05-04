const express = require("express");
const router = express.Router()
const restrauntData = require("../data/restaurants");
var passport = require("passport");
var csrf = require('csurf');
const userData = require("../data/users");
const schoolData = require("../data/schools");




router.get("/", (req, res, next) => {
    res.render("admin/login", {
        message: req.flash('loginMessage')
    });
});
router.post('/login', function (req, res, next) {
    console.log("In here login post")
    passport.authenticate('local', {
        failureFlash: true
    }, function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/admin/login');
        }
        req.logIn(user, function (err) {

            return res.redirect('/admin/dashboard');
        })
    })(req, res, next);
});

router.get("/dashboard", async function (req, res, next) {
    console.log(req.user);



    let restaurantCollection = await restrauntData.getAllRestaurants()
    if (req.isAuthenticated() && req.user.role == "admin") {
        res.render('admin/dashboard', {
            restaurants: restaurantCollection,

        });
    } else {
        res.redirect("/");
    }

})

router.get("/addlocation", async function (req, res, next) {
    const schoollist = await schoolData.getSchoolList();
    if (req.isAuthenticated() && req.user.role == "admin") {
        res.render("admin/addlocation", {
            schools: schoollist
        })
    } else {
        res.redirect("/");
    }
    
})

router.post("/addlocation", async function (req, res, next) {

    let restraunt = req.body;
    console.log(restraunt);


    //https://media-cdn.tripadvisor.com/media/photo-s/0e/cc/0a/dc/restaurant-chocolat.jpg


    //restraunt.schoolid = "c2102d25-13e6-48c5-87f8-244eefe6fc55";
    restraunt.score = 0;
    //restraunt.logoimg= "/images/restaurants/stevens/pierce_cafe.jpg"

    const newrestraunt = await restrauntData.addRestaurant(restraunt);

    res.redirect("/admin/dashboard")

})




module.exports = router;