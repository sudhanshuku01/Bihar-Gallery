import mongoose from "mongoose";
const { Schema } = mongoose;

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageKey: {
      type: String,
      default: null,
    },
    html: {
      type: String,
      required: true,
    },
    slugTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    tags: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
