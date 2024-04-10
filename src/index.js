require("dotenv/config");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { vertify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");

// 1.register a user
// 2. Login a user
// 3. Logout a user
// 4. Setup a protected route
// 5. Get a new accesstoken with a refresh token

const server = express();

// use express middleware for easier cookies handling
server.use(cookieParser());

server.use(cors({ origin: "http://localhost:3000", credentials: true }));

// need to be read body data
server.use(express.json()); // to support JSON Encoded bodies
server.use(express.urlencoded({ extended: true })); // url encoded bodies

server.listen(process.env.PORT),
  console.log(`server listening on port ${process.env.PORT}`);

// 1. Register a users
server.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await hash(password, 10);
    console.log(hashedPassword);
  } catch (err) {
    console.log(err);
  }
});
