require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
var cors = require("cors");

const app = express();

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express Token Auth. System",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It uses jsonwebtoken to sign token for user to access some  endpoints. Copy token response from login or sigin to access endpoints",
    contact: {
      name: "Jsonwebtoken",
      url: "https://jwt.io/",
    },
  },
  servers: [
    {
      url: "https://tokenized.onrender.com/",
      description: "Prod server",
    },
    {
      url: "http://localhost:4000",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./api/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

// importing the user schema
const User = require("../models/user");

// middleware for token authentication
const auth = require("../middleware/auth");

// swagger component for user
/**
 * @swagger
 * components:
 *   schemas:
 *     NewUser:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username.
 *           example: kooljoe
 *         email:
 *           type: string
 *           description: The user's email.
 *           example: kool@test.com
 *         password:
 *           type: string
 *           description: The user's password
 *           example: 1234567
 *     User:
 *       allOf:
 *         - type: object
 *           properties:
 *         - $ref: '#/components/schemas/NewUser'
 *             token:
 *               type: string
 *               description: New token assigned to user
 *               example: evv1234sxs3567cr4fgr3/3=vdded334efer3...
 */

// swagger component for errors
/**
 * @swagger
 * components:
 *   responses:
 *     NotFound:
 *       description: The specified resource was not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     Unauthorized:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *   schemas:
 *    # Schema for error response body
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *     required:
 *       - error
 */

// redirect to home
app.get("/", (req, res) => {
  res.redirect("/home");
});

/**
 * @swagger
 * /home:
 *   get:
 *     summary: home page
 *     description: directs the user to signin or lsignup to retrieve token
 *     responses:
 *       200:
 *         description: the homepage
 *         content:
 *           text:
 *             example: hello there login or signup to recieve a token
 */

app.get("/home", (req, res) => {
  res.send("hello there login or signup to recieve a token");
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Signs up a new user
 *     description: recieves user details to sign them up and returns the user object with a new token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

//signup logic starts
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ error: "all fields are required" });
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
      newUser.tokenExpiresIn = token.expiresIn;

      // return the new user
      if (await newUser.save()) {
        res.status(201).json(newUser);
      }
    }
  } catch (error) {
    console.error(error);
  }
});
//   signup logic ends

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Signs in a  user
 *     description: recieves user details to sign in the user and returns the user object with a new token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: kool@mail.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: 1234567
 *     responses:
 *       200:
 *         description: 0k
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// sign logic starts
app.post("/signin", async (req, res) => {
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
        res.status(401).json({ error: "email or password incorrect" });
      }
    }
  } catch (error) {
    console.log(error);
  }
  //login logic ends
});
// signin logic ends

/**
 * @swagger
 * /welcome:
 *   get:
 *     summary: A simple welcome
 *     description: welcomes the user after they might have sign in with  token
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: 0k
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 greet:
 *                   type: string
 *                   description: welcome response
 *                   example: Welcome to tokenized by kooljoe 🙌...
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Unauthorized'
 */

// greeting route starts
app.get("/welcome", auth, (_req, res) => {
  res
    .status(200)
    .json({ greet: "Welcome to tokenized by kooljoe 🙌, token is valid" });
});
// greeting route ends

/**
 * @swagger
 * /username:
 *   get:
 *     summary: Returns the user's username
 *     description: makes as request for the user's username sent with a request header
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: 0k
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: the requested username
 *                   example: Your username is kooljoe
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// get username using auth starts
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
// get username using auth ends

/**
 * @swagger
 * /set_username:
 *   post:
 *     summary: Sets a new username
 *     description: makes as request for the user's username to be changed sent with a request header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username to   be set.
 *                 example: kool@mail.com
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         required: true
 *     responses:
 *       201:
 *         description: changed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 changed:
 *                   type: string
 *                   description: changed status
 *                   example: Your username changed successfully from kooljoe to kooldev
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
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
 * @swagger
 * /delete_user:
 *   delete:
 *     summary: Deletes a user
 *     description: makes as request for the user's profile to be deleted sent with a request header
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         required: true
 *     responses:
 *       201:
 *         description: changed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 changed:
 *                   type: string
 *                   description: changed status
 *                   example: User profile removed succesfully 👌
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// delete user using auth starts
app.delete("/delete_user", auth, async (req, res) => {
  const email = req.user.email;
  try {
    const user = await User.deleteOne({ email: email });

    if (user.acknowledged) {
      res.status(201).json({ changed: `User profile removed succesfully 👌` });
    }
  } catch {
    (err) => {
      console.log(err);
    };
  }
});
// delete user using auth ends
module.exports = app;
