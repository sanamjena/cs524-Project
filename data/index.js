const userRoute = require("./users");
const constructorMethod = (app) => {
    app.use("/users", userRoute);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    })
};
module.exports = constructorMethod;