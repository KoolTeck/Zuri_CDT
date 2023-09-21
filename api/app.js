require("dotenv").config();
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
const User = require("../models/user");

// middleware for token authentication
const auth = require("../middleware/auth");

/**
 * @api {get} / Entry point
 *
 *
 * @apiSuccess {String} direction to log in or sign up
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     hello there login or signup to recieve a token
 *
 */
app.get("/", (req, res) => {
  res.send("hello there login or signup to recieve a token");
});

/**
 * @apiDefine ValueError
 *
 * @apiError InvalidValueError The value supplied by the user is invalid or empty.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *        errror: "all fields are required"
 *     }
 *
 *     {
 *        error: "invalid email"
 *     }
 *
 *     {
 *        error: "user already exist, kindly login"
 *      }
 */

/**
 * @apiDefine AuthError
 *
 * @apiError tokenError The token supplied by the user in the header is either expired or invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *        errror: "a token is required for authentication"
 *     }
 *
 *     HTTP/1.1 401 permision declined
 *
 *     {
 *        error: "Invalid token supplied, login to get a new token"
 *     }
 *
 */

/**
 * @api {post} /signup/ Register a new user
 * @apiName Signup
 * @apiGroup User
 *
 * @apiParam {String} username username of the new user
 * @apiParam {String} email email of the new user
 * @apiParam {String} password passwword of the new user
 *
 * @apiSuccess {json} json containing details of the new user created with a token generated
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 created
 *    {
 *      "username": "kooldev",
 *       "email": "test1@mail.com",
 *      "password": "$2a$10$UURKRFXqo6E3bwlg.wWhneh2pwOE3EoEpZi8vMCbGPqC93aGZhHeO",
 *       "_id": "650c278d894e0cd155c0ea4b",
 *       "__v": 0,
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJ1c2VyX2lkIjoiNjUwYzI3OGQ4OTRlMGNkMTU1YzBlwiO
 *     }
 *
 *  @apiUse ValueError
 */

app.post("/signup", async (req, res) => {
  //signup logic starts
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ errror: "all fields are required" });
    } else if (username.length < 7) {
      res
        .status(400)
        .json({ error: "username must be between seven and above chars" });
    } else if (!email.includes("@")) {
      res.status(400).json({ error: "invalid email" });
    } else if (
      typeof username !== "string" ||
      typeof password != "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({ error: "inputs must be a string" });
    } else {
      // check if user already exist
      // Validate if user exist in our database
      const checkOldUser = await User.findOne({ email });
      if (checkOldUser) {
        res.status(401).json({ error: "user already exist, kindly login" });
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

/**
 * @api {post} /signin/ Register a new user
 * @apiName Signin
 * @apiGroup User
 *
 * @apiParam {String} email email of the new user
 * @apiParam {String} password passwword of the new user
 *
 * @apiSuccess {json} json containing details of the user with a new token generated
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "username": "kooldev",
 *       "email": "test1@mail.com",
 *      "password": "$2a$10$UURKRFXqo6E3bwlg.wWhneh2pwOE3EoEpZi8vMCbGPqC93aGZhHeO",
 *       "_id": "650c278d894e0cd155c0ea4b",
 *       "__v": 0,
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJ1c2VyX2lkIjoiNjUwYzI3OGQ4OTRlMGNkMTU1YzBlwiO
 *     }
 *
 * @apiUse ValueError
 */
app.post("/signin", async (req, res) => {
  //login logic starts
  try {
    const { email, password } = req.body;
    // validate
    if (!email && !password) {
      res.status(400).send("all fields are required");
    } else if (typeof password !== "string" || typeof email !== "string") {
      res.status(400).send("inputs must be a string");
    } else if (!email.includes("@")) {
      res.status(400).send("invalid email");
    } else {
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
        res.status(400).json({ error: "email or password incorrect" });
      }
    }
  } catch (error) {
    console.log(error);
  }
  //login logic ends
});

/**
 * @api {get} /welcome/ Just a simple welcome endpoint that requires auth. token
 * @apiName Greeting
 * @apiGroup User
 *
 * @apiHeader {String} access-token Users unique access-token.
 *
 * @apiSuccess {json} json containing the greeting
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        greet: "Welcome to tokenized by kooljoe 🙌"
 *     }
 *
 * @apiUse AuthError
 */

// greeting
app.get("/welcome", auth, (_req, res) => {
  res.status(200).json({ greet: "Welcome to tokenized by kooljoe 🙌" });
});

/**
 * @api {get} /username/ Returns a user's username
 * @apiName Username
 * @apiGroup User
 *
 * @apiHeader {String} access-token Users unique access-token.
 *
 * @apiSuccess {json} json containing the greeting
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        greet: "Your username is kooljoe"
 *     }
 *
 * @apiUse AuthError
 *
 * @apiError UserNotFoundError the username was not in the database
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *        errror: "User does not exist"
 *     }
 *
 */

// get username using auth
app.get("/username", auth, async (req, res) => {
  const { user_id } = req.user;
  try {
    const user = await User.findById(user_id);
    if (!user) {
      res.status(400).json({ error: `User does not exist` });
    } else {
      res.status(200).json({ username: `Your username is ${user.username}` });
    }
  } catch {
    (err) => {
      console.log(err);
    };
  }
});

/**
 * @api {get} /set_username/ Changes a user's username
 * @apiName SetUsername
 * @apiGroup User
 *
 * @apiHeader {String} access-token Users unique access-token.
 *
 * @apiSuccess {json} json containing the status
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 created
 *     {
 *        change: "Your username changed successfully from Jothn to Doe 👍"
 *     }
 *
 * @apiUse AuthError
 *
 * @apiUse ValueError
 *
 * @apiError UserNotFoundError the username was not in the database
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *        errror: "user not found"
 *     }
 *
 */

// change username using auth
app.post("/set_username", auth, async (req, res) => {
  // get user id from the req.user
  const { user_id } = req.user;
  const username = req.body.username;
  if (!username) {
    res.status(400).json({ error: "new username value required" });
  } else {
    try {
      // look for user in db
      const user = await User.findById(user_id);
      if (!user) {
        res.status(400).json({ error: "user not found" });
      } else {
        // update user's username
        const initialUsername = user.username;
        user.username = username;
        res.status(201).json({
          changed: `Your username changed successfully from ${initialUsername} to ${user.username} 👍`,
        });
      }
    } catch {
      (err) => {
        console.log(err);
      };
    }
  }
});

/**
 * @api {get} /delete_user/ Deletes a user's data
 * @apiName DeleteUser
 * @apiGroup User
 * @apiSampleRequest https://tokenized.cyclic.cloud/delete_user
 * @apiHeader {String} access-token Users unique access-token.
 * @apiSuccess {json}  containing the delete status
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 created
 *     {
 *        change: "Your username changed successfully from John to Doe 👍"
 *     }
 * @apiUse AuthError
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
