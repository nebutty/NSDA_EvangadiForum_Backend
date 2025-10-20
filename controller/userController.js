// controller/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbconnection = require('../db/dbConfig');
const { StatusCodes } = require('http-status-codes');

async function register(req, res) {
  const { username, email, firstname, lastname, password } = req.body;

  if (!username || !email || !firstname || !lastname || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required information" });
  }

  try {
    const [existingUser] = await dbconnection.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUser.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "Username or Email already exists" });
    }

    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbconnection.query(
      "INSERT INTO users (username, email, firstname, lastname, password) VALUES (?, ?, ?, ?, ?)",
      [username, email, firstname, lastname, hashedPassword]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter all required fields" });
  }

  try {
    const [user] = await dbconnection.query(
      "SELECT username, userid, password FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: user[0].username, userid: user[0].userid },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res
      .status(StatusCodes.OK)
      .json({ msg: "User login successful", token });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error" });
  }
}

async function checkUser(req, res) {
  const { username, userid } = req.user;
  res.status(StatusCodes.OK).json({ msg: "Valid user", username, userid });
}

module.exports = { register, login, checkUser };
