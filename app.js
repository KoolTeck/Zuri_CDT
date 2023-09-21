require("dotenv").config();
require("./config/db").connect();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

// importing the user schema
const User = require("./models/user");

// middleware for token authentication
const auth = require("./middleware/auth");
app.get("/", (req, res) => {
  res.send("hello there login or signup to recieve a token");
});

app.post("/signup", async (req, res) => {
  //signup logic starts
  try {
    const { username, email, password } = req.body;
    if (!username && !email && !password) {
      res.status(400).send("all fields are required");
    } else if (username.length < 7) {
      res.status(400).send("username must be between seven and above chars");
    } else if (!email.includes("@")) {
      res.status(400).send("invalid email");
    } else if (typeof password != "string") {
      res.status(400).send("password must be a string");
    } else {
      // check if user already exist
      // Validate if user exist in our database
      const checkOldUser = await User.findOne({ email });
      if (checkOldUser) {
        res.status(401).send("user already exist, kindly login");
      }
      // encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);
      // create new user in db
      const newUser = await User.create({
        username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });
      // create token
      const token = jwt.sign(
        { user_id: newUser.id, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "2hr",
        }
      );
      // save token to db
      newUser.token = token;

      // return the new user
      res.status(201).json(newUser);
    }
  } catch (error) {
    console.error(error);
  }

  //   signup logic ends
});

app.post("/login", async (req, res) => {
  //login logic starts
  try {
    const { email, password } = req.body;
    // validate
    if (!email && !password) {
      res.status(400).send("all fields are required");
    } else if (!email.includes("@")) {
      res.status(400).send("invalid email");
    }
    //   check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    // check password

    if (user && (await bcrypt.compare(password, user.password))) {
      // assign new token
      const token = jwt.sign(
        {
          user_id: user.id,
          email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2hr",
        }
      );
      //   save user
      user.token = token;

      res.status(200).json(user);
    } else {
      res.status(400).send("email or password incorrect");
    }
  } catch (error) {
    console.log(error);
  }
  //login logic ends
});

// greeting
app.get("/welcome", auth, (_req, res) => {
  res.status(200).send("Welcome to tokenized by kooljoe 🙌");
});

// get username using auth
app.get("/username", auth, async (req, res) => {
  const { user_id } = req.user;
  try {
    const user = await User.findById(user_id);
    if (!user) {
      res.status(401).send(`User does not exist`);
    } else {
      res.status(201).send(`Your username is ${user.username}`);
    }
  } catch {
    (err) => {
      console.log(err);
    };
  }
});

// change username using auth
app.post("/set_username", auth, async (req, res) => {
  // get user id from the req.user
  const { user_id } = req.user;
  const username = req.body.username;
  if (!username) {
    res.status(400).send("new username value required");
  } else {
    try {
      // look for user in db
      const user = await User.findById(user_id);
      if (!user) {
        res.status(401).send("user not found");
      } else {
        // update user's username
        const initialUsername = user.username;
        user.username = username;
        res
          .status(201)
          .send(
            `Your username changed successfully from ${initialUsername} to ${user.username} 👍`
          );
      }
    } catch {
      (err) => {
        console.log(err);
      };
    }
  }
});

/**
 * deletes a user from the db
 */
app.delete("/delete_user", auth, async (req, res) => {
  const email = req.user.email;
  try {
    const user = await User.deleteOne({ email: email });

    if (user.acknowledged) {
      res.status(201).send(`User profile removed succesfully 👌`);
    }
  } catch {
    (err) => {
      console.log(err);
    };
  }
});
module.exports = app;
