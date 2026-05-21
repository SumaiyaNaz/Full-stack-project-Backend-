import Users from "../models/UsersSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const addUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(400).json({
        status: false,
        message: "required feilds",
      });
    }
    
    const hashPass = await bcrypt.hash(req.body.password, 10);
    const data1 = { name, email, password: hashPass, role: req.body.role || 'user' };
    const user = new Users(data1);
    const data = await user.save();
    if(data){
      const token = jwt.sign(
        { id: data._id, email: data.email, role: data.role },
        process.env.JWT_SECRET
      );
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      });
      
      const userWithoutPassword = data.toObject();
      delete userWithoutPassword.password;
      
      return res.status(201).json({
        status: true,
        message: "user created successfully",
        user: userWithoutPassword,
        token: token
      });
    }
  } catch (error) {
    console.log("error in creating user-->", error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "all fields are required",
      });
    }
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "cannot find user",
      });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(isPasswordValid){
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET
      );
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      });
      
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      
      return res.status(200).json({
        status: true,
        message: "user login successfully",
        user: userWithoutPassword,
        token: token,
      });
    } else {
      return res.status(401).json({
        status: false,
        message: 'invalid credentials',
      });
    }
  } catch (error) {
    console.log("error in login user-->", error.message);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await Users.find().select("-password");
    res.json({
      status: true,
      message: "user fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "cannot find user",
      });
    }
    res.json({
      status: true,
      message: "user fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await Users.findByIdAndUpdate(id, req.body, { new: true }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    res.json({
      status: true,
      message: "user updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    res.json({
      status: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      status: true,
      message: "user logout successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const UserProfile = async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({
        status: true,
        user: req.user
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export {
  addUser,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  logout,
  UserProfile
};