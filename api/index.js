const app = require("./app");

const { SERVER_PORT } = process.env;
const port = process.env.PORT || SERVER_PORT;

require("../config/db")
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log("app listening on port " + port);
    });
  });