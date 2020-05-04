const MongoClient = require("mongodb").MongoClient;

const settings = {
  mongoConfig: {
    serverUrl:
      "mongodb+srv://sanam:sanam007@cs524-campus-tour-guide-x7ke8.mongodb.net/test?retryWrites=true&w=majority",
    // "mongodb://sanam:sanam007@cs524-campus-tour-guide-shard-00-00-x7ke8.mongodb.net:27017,cs524-campus-tour-guide-shard-00-01-x7ke8.mongodb.net:27017,cs524-campus-tour-guide-shard-00-02-x7ke8.mongodb.net:27017/test?ssl=true&replicaSet=CS524-Campus-Tour-Guide-shard-0&authSource=admin&retryWrites=true&w=majority",
    database: "campus_tour",
  },
};

// let fullMongoUrl =
//   settings.mongoConfig.serverUrl + settings.mongoConfig.database;
// let _connection = undefined;

// let connectDb = () => {
//   if (!_connection) {
//     _connection = MongoClient.connect(fullMongoUrl).then((db) => {
//       return db;
//     });
//   }

//   return _connection;
// };

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(settings.mongoConfig.serverUrl, {
      // useNewUrlParser: true,
    });
    _db = await _connection.db(settings.mongoConfig.database);
  }

  return _db;
};

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }
    return _col;
  };
};

module.exports = {
  users: getCollectionFn("users"),
  schools: getCollectionFn("schools"),
  restaurants: getCollectionFn("restaurants"),
  comments: getCollectionFn("comments"),
  dbConnection,
};
