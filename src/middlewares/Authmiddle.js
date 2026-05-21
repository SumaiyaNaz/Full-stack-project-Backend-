import jwt from "jsonwebtoken";
import Users from "../models/UsersSchema.js";

const userCheck = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1] || req.cookies.token;
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "token not found",
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const findUser = await Users.findById(decoded.id).select("-password");
    if (!findUser) {
      return res.status(401).json({
        status: false,
        message: "user not valid",
      });
    }
    req.user = findUser;
    next();
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error.message,
    });
  }
};

export { userCheck };