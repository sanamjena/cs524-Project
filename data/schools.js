const mongoCollections = require("../config/mongoConnection");
const schools = mongoCollections.schools;
const uuid = require("node-uuid");

let exportedMethods = {
  async getSchoolList() {
    const schoolModel = await schools();
    const schoolCollection = await schoolModel.find({}).toArray();
    return schoolCollection;
  },

  async getSchoolById(id) {
    if (id && id != null) {
      const schoolCollection = await schools();
      const school = await schoolCollection.findOne({ _id: id });
      if (!school) {
        throw "Oops! School not found";
      }
      return school;
    } else {
      throw "School does not exist with that ID";
    }
  },

  async addSchool(school) {
    const schoolCollection = await schools();
    const newSchool = {
      _id: uuid.v4(),
      schoolname: school.name,
      schoolimg: school.img,
    };
    const schoolInserted = await schoolCollection.insertOne(newSchool);
    const schoolId = schoolInserted.insertedId;
    schoolStored = await this.getSchoolById(schoolId);
    return schoolStored;
  },
};

module.exports = exportedMethods;
