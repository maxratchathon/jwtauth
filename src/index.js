require("dotenv/config");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { vertify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const fakeDB = require("./fakeDB");
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("./token.js");

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
    // 1. Check if the user exist
    const user = await fakeDB.find((user) => user.email == email);
    if (user) {
      throw new Error("user already exist");
    }
    // 2.if user not exist, hash the password
    const hashedPassword = await hash(password, 10);
    fakeDB.push({
      id: fakeDB.length,
      email,
      password: hashedPassword,
    });
    res.send({ message: "User Created" });
    console.log(fakeDB);
  } catch (err) {
    res.send({ error: `${err.message}` });
    console.log(err);
  }
});

server.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await fakeDB.find((user) => user.email == email);
  // 1. user does not exist
  if (!user) {
    throw new Error("user does not exist"); // user does not exist
  }
  // 2. Compare crypted password and see if it check, send error if not
  const valid = await compare(password, user.password);
  if (!valid) throw new Error("username or password is incorrect");

  // 3. Create Refresh token and Access Token
  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  // 4. Put token inside the database
  user.refreshToken = refreshToken;
  user.accessToken = accessToken;
  console.log(fakeDB);

  // 5. Send token, refreshToken as a cookie and accessToken as a regular token
  sendRefreshToken(res, refreshToken);
});
