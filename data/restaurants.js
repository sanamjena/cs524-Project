const mongoCollections = require("../config/mongoConnection");
const restaurants = mongoCollections.restaurants;
const uuid = require("node-uuid");
const userData = require("../data/users");

let exportedMethods = {
  async getAllRestaurants() {
    const restaurantModel = await restaurants();
    const restaurantCollection = await restaurantModel.find({}).toArray();
    return restaurantCollection;
  },

  async getRestaurantBySchoolId(schoolId) {
    if (schoolId && schoolId != null) {
      const restaurantCollection = await restaurants();
      var query = { schoolid: schoolId };
      const schoolRestaurantCollection = restaurantCollection
        .find(query)
        .toArray();
      return schoolRestaurantCollection;
    } else {
      throw "School not found withh the ID specified.";
    }
  },

  async getRestaurantById(id) {
    if (id && id != null) {
      const restaurantCollection = await restaurants();
      const restaurant = await restaurantCollection.findOne({ _id: id });
      if (!restaurant) {
        throw "Oops! no restaurant found.";
      }
      return restaurant;
    } else {
      throw "Restaurant does not exist with that ID specified.";
    }
  },

  async addRestaurant(restaurant) {
    const restaurantCollection = await restaurants();
    const newRestaurant = {
      _id: uuid.v4(),
      name: restaurant.name,
      schoolid: restaurant.schoolid,
      score: restaurant.score,
      logoimg: restaurant.logoimg,
      description: restaurant.description,
      address: restaurant.address,
      comments: [],
    };
    const restaurantInserted = await restaurantCollection.insertOne(
      newRestaurant
    );
    const restaurantId = restaurantInserted.insertedId;
    restaurantStored = await this.getRestaurantById(restaurantId);
    return restaurantStored;
  },

  async deleteRestraunt(id) {
    const restaurantCollection = await restaurants();
    const deleteinfo = await restaurantCollection.removeOne({
      _id: id,
    });
    if (deleteinfo.deleteCount === 0) {
      return false;
    }
    return true;
  },

  async voteRestaurant(restaurantJSON, userId) {
    restaurant = await this.getRestaurantById(restaurantJSON.restaurantid);
    const restaurantCollection = await restaurants();
    // console.log("TYPE OF VOTE:" + typeof(restaurantJSON.vote));
    if (restaurantJSON.vote == "true") {
      restaurant.score += 1;
    } else {
      console.log("Got inside the else part");
      restaurant.score -= 1;
    }
    console.log("Data before query: " + JSON.stringify(restaurant));
    // restaurant.validation = true;
    // return restaurant;
    let updatecommand = {
      $set: restaurant,
    };
    const query = {
      _id: restaurantJSON.restaurantid,
    };
    await restaurantCollection.updateOne(query, updatecommand);
    updatedData = await this.getRestaurantById(restaurantJSON.restaurantid);
    if (restaurantJSON.vote == "true") {
      await userData.saveRestaurantVoted(restaurantJSON.restaurantid, userId);
    } else {
      await userData.removeVoteForRestaurant(
        restaurantJSON.restaurantid,
        userId
      );
    }
    updatedData.validation = true;
    return updatedData;
  },
};

module.exports = exportedMethods;
