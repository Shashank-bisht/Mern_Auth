import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  // console.log(req.body)
  const { username, email, password } = req.body;
  // Check if the username or email already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    // User with the same username or email already exists
    return res
      .status(400)
      .json({ message: "Username or email already in use" });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    next(error);
  }
};

// signin
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    // if user not found then send error
    if (!validUser) {
      return next(errorHandler(401, "Invalid email or password"));
    }
    // if user found then compare password
    const validPassword = await bcryptjs.compare(password, validUser.password);
    // if password not matched then send error
    if (!validPassword) {
      return next(errorHandler(401, "Invalid email or password"));
    }
    // if password matched then generate token using id
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    //{ password: hashedPassword, ...rest }: This is an object destructuring assignment. It extracts the password property from validUser._doc and renames it to hashedPassword. The rest of the properties in validUser._doc are collected into a new object named rest using the rest operator (...).

    const { password: hashedPassword, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true ,expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)})
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};


// function for google login
export const google = async (req, res, next) => {
  try {
    // Attempt to find a user in the database with the provided email
    const user = await User.findOne({ email: req.body.email });

    // Check if the user already exists
    if (user) {
      // If user exists, generate a JSON Web Token (JWT) for authentication
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      // Extract sensitive information from the user object (e.g., password)
      const { password, ...rest } = user._doc;

      // Set the expiration date for the cookie (1 hour from the current time)
      const expiryDate = new Date(Date.now() + 3600000);

      // Set an HTTP-only cookie containing the JWT
      res.cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDate
      }).status(200).json(rest);
    } else {
      // If user does not exist, generate a random password and hash it
      const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatePassword, 10);

      // Create a new user with the provided information
      const newUser = new User({
        username: req.body.name.split(' ').join('').toLowerCase() + Math.floor(Math.random() * 100000).toString(),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo
      });

      // Save the new user to the database
      await newUser.save();

      // Generate a JWT for the new user
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      // Extract sensitive information from the new user object
      const { password: hashedPassword2, ...rest } = newUser._doc;

      // Set the expiration date for the cookie
      const expiryDate = new Date(Date.now() + 3600000);

      // Set an HTTP-only cookie containing the JWT
      res.cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDate
      }).status(200).json(rest);
    }
  } catch (error) {
    // Handle any errors that occur during the process
    next(error);
  }
};


export const signout = (req, res) => {
  res.clearCookie("access_token").status(200).json("User has been signed out.");
}