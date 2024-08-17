import path from "path";
import JWT from "jsonwebtoken";
import slugify from "slugify";
import * as dotenv from "dotenv";
import fs from "fs";
import User from "../model/UserModel.js";
import { comparePassword, hashPassword } from "../authhelper/AuthHelper.js";
import sendMail from "../authhelper/NodeMailer.js";
dotenv.config();

export const SignupController = async (req, res) => {
  try {
    const { email, password, userName, fullName } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "password is required",
      });
    }
    if (!userName) {
      return res.status(400).json({
        success: false,
        message: "userName is required",
      });
    }
    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "fullName is required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email }, { userName: userName }],
    });
    //exisiting user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "user already exist please do login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new User({
      userName,
      email,
      password: hashedPassword,
      fullName,
    }).save();

    const verificationToken = JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET
    );

    await sendMail(email, verificationToken);

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "server error",
      error,
    });
  }
};

export const VerifyEmail = async (req, res) => {
  try {
    const verificationToken = decodeURIComponent(req.query.token);
    const email = decodeURIComponent(req.query.email);

    if (!email || !verificationToken) {
      res.send("server error please try after some time");
    }

    const decoded = JWT.verify(verificationToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.send("don't be oversmart! signup first");
    }

    user.isVerified = true;
    await user.save();

    res.sendFile(path.join(process.cwd(), "./authhelper/success.html"));
  } catch (error) {
    console.log(error);
    res.sendFile(path.join(process.cwd(), "./authhelper/success.html"));
  }
};

export const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "email and pasword both required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.googleId != null) {
      return res.status(400).send({
        success: false,
        message: "Login with google",
      });
    }

    if (user.isVerified === false) {
      return res.status(401).json({
        success: false,
        message: "Verify your email address first",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user.id,
        userName: user.userName,
        fullName: user.fullName,
        address: user.address,
        instagram: user.instagram,
        about: user.about,
        postLeft: user.postLeft,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const UserProfile = async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not exist with this userName",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user found successfully",
      Data: {
        _id: user.id,
        userName: user.userName,
        fullName: user.fullName,
        address: user.address,
        instagram: user.instagram,
        about: user.about,
        postLeft: user.postLeft,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in finding profile",
      error,
    });
  }
};

export const CheckUserName = async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res
      .status(400)
      .json({ success: false, message: "userName is required" });
  }

  try {
    const user = await User.findOne({ userName });

    if (user) {
      return res.json({
        success: false,
        message: "userName is already taken",
      });
    }

    return res.json({ success: true, message: "userName is available" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const UpdateUser = async (req, res) => {
  const { userId } = req.params;
  const { image } = req.files;

  try {
    if (image && image.size > 5000000) {
      return res.status(400).json({
        success: false,
        message: "image size should be less than 5MB",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...req.fields },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "User with id not found",
      });
    }
    if (image) {
      updatedUser.image.data = fs.readFileSync(image.path);
      updatedUser.image.contentType = image.type;
    }

    await updatedUser.save();

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      Data: {
        fullName: updatedUser.fullName,
        address: updatedUser.address,
        about: updatedUser.about,
        instagram: updatedUser.instagram,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const GetUserImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("image");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.image.data) {
      res.set("Content-type", user.image.contentType);
      return res.status(200).send(user.image.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

export const CheckAdmin = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isAdmin = user.role === "admin";
    if (isAdmin) {
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(200).json({
        success: false,
      });
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking admin status",
      error: error.message,
    });
  }
};

export const CheckTokenValid = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(404).json({
      success: false,
      message: "userId is required",
    });
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      messsage: "Unauthorized access",
    });
  }
  try {
    if (userId !== user.id) {
      return res.status(404).json({
        success: false,
        message: "Token is not valid or invalid",
      });
    }
    res.status(200).json({
      success: true,
      message: "Token is valid",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

export const GoogleLoginWithExistingEmail = async (req, res) => {
  const { googleId, email, fullName } = req.body;

  if (!googleId || !email || !fullName) {
    return res.status(400).json({
      success: false,
      message: "All Fields is required",
    });
  }

  try {
    const existinguser = await User.findOne({ email });

    if (!existinguser) {
      return res.status(204).json({
        success: false,
        message: "User with this email not found",
      });
    }

    existinguser.googleId = googleId;
    existinguser.fullName = fullName;
    existinguser.isVerified = true;
    existinguser.save();
    const token = JWT.sign({ _id: existinguser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: existinguser.id,
        userName: existinguser.userName,
        fullName: existinguser.fullName,
        address: existinguser.address,
        instagram: existinguser.instagram,
        about: existinguser.about,
        postLeft: existinguser.postLeft,
        totalPost: existinguser.totalPost,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "server error",
      error,
    });
  }
};

export const GoogleLogin = async (req, res) => {
  const { googleId, email, fullName, userName } = req.body;
  if (!googleId || !email || !fullName) {
    return res.status(400).json({
      success: false,
      message: "All Fields is required",
    });
  }
  try {
    const existinguser = await User.findOne({ googleId });
    if (existinguser) {
      existinguser.email = email;
      existinguser.fullName = fullName;
      existinguser.save();

      const token = JWT.sign(
        { _id: existinguser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.status(200).send({
        success: true,
        message: "login successfully",
        user: {
          _id: existinguser.id,
          userName: existinguser.userName,
          fullName: existinguser.fullName,
          address: existinguser.address,
          instagram: existinguser.instagram,
          about: existinguser.about,
          postLeft: existinguser.postLeft,
          totalPost: existinguser.totalPost,
        },
        token,
      });
    }

    const user = await new User({
      googleId,
      userName,
      email,
      fullName,
      isVerified: true,
    }).save();
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user.id,
        userName: user.userName,
        fullName: user.fullName,
        address: user.address,
        instagram: user.instagram,
        about: user.about,
        postLeft: user.postLeft,
        totalPost: user.totalPost,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "server error",
      error,
    });
  }
};
