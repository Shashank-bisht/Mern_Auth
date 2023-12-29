import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
export const signup = async(req,res,next)=>{
    // console.log(req.body)
  const {username, email, password} = req.body;
  // Check if the username or email already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    // User with the same username or email already exists
    return res.status(400).json({ message: 'Username or email already in use' });
  }
  const hashedPassword = bcryptjs.hashSync(password,10)
  const newUser = new User({username, email, password:hashedPassword});
  try{
    await newUser.save()
    res.status(201).json({message:"user created successfully"});
  }catch(error){
    next(error)
  }
}