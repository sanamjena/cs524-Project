const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
  const user = await users.addUser("athiban","parthiban");
  console.log(user);
  console.log("Done seeding database");
  await db.close();
}

main();