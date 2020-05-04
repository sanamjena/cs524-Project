const path = require("path");
const userRoutes = require("./users");
const schoolRoutes = require("./schools");
const restaurantRoutes = require("./restaurants");
const commentsRoutes = require("./comments");
const schoolData = require("../data/schools");
const adminRoutes = require("../routes/admin")


const constructorMethod = app => {
  // User Routes
  app.use("/user", userRoutes);

  // School Routes
  app.use("/school", schoolRoutes);

  // Restaurant Routes
  app.use("/restaurant", restaurantRoutes);

  app.use("/admin", adminRoutes)

  // Comment Routes
  app.use("/comment", commentsRoutes);

  // Route to get to the Homepage
  app.get('/', async function(req, res, next) {
      schools = await schoolData.getSchoolList();
      res.render('index', { 
        title: 'Express',
        schools: schools
      });
  });

  app.get("/about", (req, res) => {
    res.sendFile(path.resolve("static/about.html"));
  });

  app.use("*", (req, res) => {
    console.log("Caught in here");
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
