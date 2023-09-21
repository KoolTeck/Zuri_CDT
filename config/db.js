const mongoose = require("mongoose");
const { MONGODB_URI } = process.env;

exports.connect = async () => {
  await mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected to db successfully @" + MONGODB_URI);
    })
    .catch((error) => {
      console.log("unable to connect to db, exiting now...");
      console.error(error);
      process.exit(1);
    });
};
