const dbConnection = require("./config/mongoConnection");
const schools = require("./data/schools");
const restraunts = require("./data/restaurants");
const userdata = require("./data/users");
const bcrypt = require("bcrypt-nodejs");

const main = async () => {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  const firstSchool = await schools.addSchool({
    name: "Stevens Institute of Technology",
    img: "/images/stevens.png",
  });

  const restraunt1 = await restraunts.addRestaurant({
    name: "Pierce Cafe",
    schoolid: firstSchool._id,
    score: 0,
    logoimg: "/images/restaurants/stevens/pierce_cafe.jpg",
    description:
      "Pierce Cafe features Peet’s Coffee & Mighty Leaf Tea, Grab & Go salads, sandwiches, snacks, smoothies, desserts & more.  Don’t forget to try our new daily drink specials!",
    address: "Wesley J. Howe Center, 2nd Floor",
    comments: [],
  });

  const restraunt2 = await restraunts.addRestaurant({
    name: "Pierce Dining Hall",
    schoolid: firstSchool._id,
    score: 0,
    logoimg: "/images/restaurants/stevens/pierce_dining_hall.jpg",
    description:
      "Pierce Dining Hall is the central dining hall for the Stevens Dining Program. Focused on fresh, quality food served in a relaxing dining atmosphere, Pierce Dining Hall not only offers some of the finest foods in college dining but easily one of the best views.",
    address: "Wesley J. Howe Center, 2nd Floor",
    comments: [],
  });

  const restraunt3 = await restraunts.addRestaurant({
    name: "Red Grey Dining",
    schoolid: firstSchool._id,
    score: 0,
    logoimg: "/images/restaurants/stevens/red_grey.jpg",
    description:
      "In addition to the everyday convenience of Grab & Go and Starbucks Proudly Brew Coffee, Red & Gray features a local New Jersey built franchise Green Zebra. Green Zebra offers an assortment of freshly made wraps and salads featuring homemade organic dressings.",
    address: "Burchard Building, 1st Floor",
    comments: [],
  });

  const restraunt4 = await restraunts.addRestaurant({
    name: "Americas Cup",
    schoolid: firstSchool._id,
    score: 0,
    logoimg: "/images/restaurants/stevens/americas_cup.jpg",
    description:
      "Stevens' modern coffee house features the Starbucks Proudly Brew program, along with local favorite Bagel Smashery. And at crEATe, you can customize salads, wraps and sandwich the way you want it, right in front of your eyes!",
    address: "Samuel C Williams Library, 1st Floor",
    comments: [],
  });

  const restraunt5 = await restraunts.addRestaurant({
    name: "Colonel John's",
    schoolid: firstSchool._id,
    score: 0,
    logoimg: "/images/restaurants/stevens/cjs.jpg",
    description:
      "Colonel John's features two dining experiences. Asian Express a fast, fresh and flavorful quick serve concept based on traditional Asian cuisine and Grill Nation, a customizable burger menu offering a long list of premium ingredients, allowing for numerous combinations.",
    address: "Wesley J. Howe Center, 1st Floor",
    comments: [],
  });
  let adminPassword = "stevens2019";
  let password = userdata.encryptPassword(adminPassword);
  const adminUser = await userdata.addUser({
    firstname: "Admin",
    lastname: "User",
    username: "admin",
    email: "admin@stevens.edu",
    password: password,
    role: "admin",
  });

  let testuserpass = "sjena";
  password = userdata.encryptPassword(testuserpass);
  const testUser = await userdata.addUser({
    firstname: "Sanam",
    lastname: "Jena",
    username: "sjena007",
    email: "sjena@stevens.edu",
    password: password,
    role: "user",
  });

  console.log("Done seeding database");
  await db.serverConfig.close();
};

main().catch(console.log);
