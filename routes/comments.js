const express = require("express");
const router = express.Router();
const commentsData = require("../data/comments");
const userData = require("../data/users");
const xss = require('xss');

router.post('/addcomment', async function(req, res, next) {
    try {
        if (req.isAuthenticated()) {
            const comment = req.body;
            if(xss(comment.commenttext)) {
                let newComment = {
                    'userid': req.user._id,
                    'restaurantid':comment.restaurantid,
                    'commenttexxt': comment.commenttext
                }
                const commentSaved = await commentsData.addComment(newComment);
                let user = await userData.getUserById(commentSaved.userid);
                commentSaved.validation = true;
                commentSaved.username = user.firstname;
                res.send(commentSaved);
            }
        } else {
            const json = {
                "validation": false,
                "message": "Please login to your account to comment"
            }
            res.send(json);
        }
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;