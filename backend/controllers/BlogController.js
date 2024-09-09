import Blog from "../model/BlogModel.js";
import slugify from "slugify";
import { getObjectUrl } from "../CloudStorage.js";
// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Blog.find();
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

// Get a single post by ID
export const getPostBySlugTitle = async (req, res) => {
  const { slugTitle } = req.params;
  try {
    const post = await Blog.findOne({ slugTitle });
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  const { title, html, description, tags, imageKey } = req.body;

  if (!title || !html || !description || !tags || !imageKey) {
    return res.status(400).json({
      success: false,
      message: "Title, HTML, Description Tags and ImageKey are required",
    });
  }

  const slug = slugify(title, { lower: true });
  const randomNumber = Math.floor(Math.random() * 100000000);
  const slugTitle = `${slug}-${randomNumber}`;
  const newPost = new Blog({
    title,
    imageKey,
    html,
    slugTitle,
    description,
    tags,
  });
  try {
    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      savedPost,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a post by ID
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    // Find the post by ID without updating it yet
    const post = await Blog.findById(id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // If the title is provided and it's different from the current title, update the slug
    if (title && title !== post.title) {
      const slug = slugify(title, { lower: true });
      const randomNumber = Math.floor(Math.random() * 100000000);
      const slugTitle = `${slug}-${randomNumber}`;
      post.slugTitle = slugTitle;
    }

    // Update the post with the remaining fields from req.body
    Object.assign(post, req.body);

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      updatedPost: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a post by ID
export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await Blog.findByIdAndDelete(id);
    if (!deletedPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

export const GetImageByKey = async (req, res) => {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({
      success: false,
      message: "key is not provided!",
    });
  }
  try {
    const url = await getObjectUrl(key);
    if (!url) {
      return res.status(200).send(null);
    }
    return res.status(200).send(url);
  } catch (error) {
    console.log(error);
    res.status(500).send(null);
  }
};

export const searchPosts = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  try {
    const regex = new RegExp(query, "i");
    const posts = await Blog.find({
      $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
    });

    if (posts.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No posts found",
        posts,
      });
    }

    res.status(200).json({
      success: true,
      message: "posts found successfully",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
};
