import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, default: null },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, default: null },
    address: { type: String, default: null },
    role: { type: String, default: "user" },
    image: {
      data: { type: Buffer, default: null },
      contentType: { type: String, default: null },
    },
    instagram: { type: String, default: null },
    about: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    postLeft: { type: Number, default: 10 },
    totalPost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
