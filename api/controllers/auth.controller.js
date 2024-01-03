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
    const { password: hashedPassword, ...rest } = validUser._doc;
    res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
