const mongoCollections = require("../config/mongoConnection");
const comments = mongoCollections.comments;
const uuid = require("node-uuid");

let exportedMethods = {
  async getAllComments() {
    const commentsModel = await comments();
    const commentsCollection = await commentsModel.find({}).toArray();
    return commentsCollection;
  },

  async getCommentsByRestaurant(id) {
    if (id && id != null) {
      const commentsCollection = await comments();
      var query = { restaurantid: id };
      const commentCollection = commentsCollection.find(query).toArray();
      return commentCollection;
    } else {
      throw "No restaurant exists with the specified id";
    }
  },

  async getCommetById(id) {
    if (id && id != null) {
      const commentsCollection = await comments();
      const comment = await commentsCollection.findOne({ _id: id });
      if (!comment) {
        throw "Oops! there is no comment exist.";
      }
      return comment;
    } else {
      throw "No comment exist with the ID specified.";
    }
  },

  async addComment(comment) {
    const commentsCollection = await comments();
    const newComment = {
      _id: uuid.v4(),
      restaurantid: comment.restaurantid,
      userid: comment.userid,
      commenttext: comment.commenttexxt,
    };
    const commentInserted = await commentsCollection.insertOne(newComment);
    const commentId = commentInserted.insertedId;
    commentStored = await this.getCommetById(commentId);
    return commentStored;
  },
};

module.exports = exportedMethods;
