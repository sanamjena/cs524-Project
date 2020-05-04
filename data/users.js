const mongoCollections = require("../config/mongoConnection");
const users = mongoCollections.users;
const uuid = require("node-uuid");
const bcrypt = require("bcrypt-nodejs");

let exportedMethods = {
  async getAllUsers() {
    const userModel = await users();
    const userCollection = await userModel.find({}).toArray();
    return userCollection;
  },

  async getUserById(id) {
    if (id && id != null) {
      const userCollection = await users();
      const user = await userCollection.findOne({ _id: id });
      if (!user) {
        throw "Oops! User not found";
      }
      return user;
    } else {
      throw "User does not exist with that ID";
    }
  },

  async getUserByEmail(email) {
    if (email && email != null) {
      const userCollection = await users();
      const user = await userCollection.findOne({ email: email });
      if (!user) {
        return false;
      }
      console.log(user);
      return user;
    } else {
      return false;
    }
  },

  async getUserByUsername(username) {
    if (username && username != null) {
      const userCollection = await users();
      const user = await userCollection.findOne({ username: username });
      if (!user) {
        return false;
      }
      return user;
    } else {
      return false;
    }
  },

  async getUserByUserNameOrEmail(username, email) {
    if (username && username != null) {
      const userCollection = await users();
      const user = await userCollection.findOne({ username: username });
      if (!user) {
        return false;
      }
    }
    if (email && email != null) {
      const userCollection = await users();
      const user = await userCollection.findOne({ email: email });
      if (!user) {
        return false;
      }
    }
    return true;
  },

  async saveRestaurantVoted(restaurantId, userId) {
    const user = await this.getUserById(userId);
    const userCollection = await users();
    if (user.hasOwnProperty("votes")) {
      votes = user.votes;
      votes.push(restaurantId);
    } else {
      votes = [];
      votes.push(restaurantId);
    }
    user.votes = votes;
    let updatecommand = {
      $set: user,
    };
    const query = {
      _id: userId,
    };
    await userCollection.updateOne(query, updatecommand);
    return user;
  },

  async updateUser(newUser, userId) {
    const user = await this.getUserById(userId);
    const userCollection = await users();
    user.firstname = newUser.firstname.toLowerCase();
    user.lastname = newUser.lastname.toLowerCase();
    user.username = newUser.username.toLowerCase();
    user.email = newUser.email.toLowerCase();
    let updatecommand = {
      $set: user,
    };
    const query = {
      _id: userId,
    };
    await userCollection.updateOne(query, updatecommand);
    return this.getUserById(userId);
  },

  async removeVoteForRestaurant(restaurantId, userId) {
    const user = await this.getUserById(userId);
    const userCollection = await users();
    if (user.hasOwnProperty("votes")) {
      votes = user.votes;
      removeId = votes.indexOf(restaurantId);
      if (removeId != -1) {
        votes.splice(removeId, 1);
        user.votes = votes;
        let updatecommand = {
          $set: user,
        };
        const query = {
          _id: userId,
        };
        await userCollection.updateOne(query, updatecommand);
        return user;
      }
    } else {
      return false;
    }
  },

  async addToWishlist(data, userId) {
    console.log("User Id : " + userId);
    const user = await this.getUserById(userId);
    const userCollection = await users();
    if (user.hasOwnProperty("wishlist")) {
      wishlist = user.wishlist;
      wishlist.push(data.restaurantid);
    } else {
      console.log("Wishlist does not exist");
      wishlist = [];
      wishlist.push(data.restaurantid);
    }
    user.wishlist = wishlist;
    let updatecommand = {
      $set: user,
    };
    const query = {
      _id: userId,
    };
    await userCollection.updateOne(query, updatecommand);
    return user;
  },

  async removeFromWishlist(data, userId) {
    const user = await this.getUserById(userId);
    const restaurantId = data.restaurantid;
    const userCollection = await users();
    console.log("Restarant ID is : " + restaurantId);
    if (user.hasOwnProperty("wishlist")) {
      wishlist = user.wishlist;
      removeId = wishlist.indexOf(restaurantId);
      if (removeId != -1) {
        wishlist.splice(removeId, 1);
        user.wishlist = wishlist;
        let updatecommand = {
          $set: user,
        };
        const query = {
          _id: userId,
        };
        await userCollection.updateOne(query, updatecommand);
        return user;
      } else {
        return false;
      }
    }
    return user;
  },

  async addUser(user) {
    if (user.firstname === undefined || user.firstname === "")
      throw "Missing Firstname";
    if (user.lastname === undefined || user.lastname === "")
      throw "Missing Lastname";
    if (user.username === undefined || user.username === "")
      throw "Missing Username";
    if (user.email === undefined || user.email === "") throw "Missing Email";
    if (user.password === undefined || user.password === "")
      throw "Missing Password";
    let role = "";
    firstName = user.firstname;
    lastName = user.lastname;
    username = user.username;
    email = user.email;
    password = user.password;
    const userCollection = await users();
    if (user.role) {
      role = user.role;
    } else {
      role = "user";
    }
    const newUser = {
      _id: uuid.v4(),
      firstname: firstName,
      lastname: lastName,
      username: username,
      email: email,
      password: password,
      role: role,
    };
    const userInserted = await userCollection.insertOne(newUser);
    const userId = userInserted.insertedId;
    userStored = await this.getUserById(userId);
    // console.log(userStored);
    return userStored;
  },

  encryptPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
  },

  validPassword(password, user) {
    return bcrypt.compareSync(password, user.password);
  },
};

module.exports = exportedMethods;
