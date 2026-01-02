const Blog = require("../models/blog");

/**
 * CREATE BLOG
 */
exports.createBlog = async (req, res) => {
  try {
    const { title, paragraph, linkedinUrl } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Debug: log the file object
    console.log("Uploaded file:", req.file);

    // Cloudinary returns secure_url or url property
    const imageUrl = req.file.secure_url || req.file.url || req.file.path;

    const blog = await Blog.create({
      title,
      paragraph,
      linkedinUrl,
      image: imageUrl
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET ALL BLOGS
 */
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET SINGLE BLOG
 */
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * UPDATE BLOG
 */
exports.updateBlog = async (req, res) => {
  try {
    const updates = req.body;

    if (req.file) {
      updates.image = req.file.secure_url || req.file.url || req.file.path;
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE BLOG
 */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
