import JWT from "jsonwebtoken";
import User from "../model/UserModel.js";
import * as dotenv from "dotenv";
dotenv.config();

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = await JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Authentication failed.",
      });
    } else {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Server error. Authentication failed.",
      });
    }
  }
};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "server error authentication failed",
    });
  }
};
