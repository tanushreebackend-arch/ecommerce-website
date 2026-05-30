const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const { authAdmin } = require('../middleware/auth');

const router = express.Router();

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Blog.findOne(query);
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

// Admin: all blogs including drafts
router.get('/all', authAdmin, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public: published blogs only
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .select('-content');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: create blog
router.post(
  '/',
  authAdmin,
  [
    body('title').trim().notEmpty(),
    body('slug').optional().trim(),
    body('excerpt').optional().isLength({ max: 200 }),
    body('status').optional().isIn(['draft', 'published']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { title, slug, coverImage, excerpt, content, author, status } = req.body;
      const baseSlug = slugify(slug || title);
      const uniqueSlug = await ensureUniqueSlug(baseSlug);

      const isPublished = status === 'published';
      const blog = await Blog.create({
        title,
        slug: uniqueSlug,
        coverImage: coverImage || '',
        excerpt: excerpt || '',
        content: content || '',
        author: author || 'Admin',
        status: isPublished ? 'published' : 'draft',
        publishedAt: isPublished ? new Date() : undefined,
      });

      res.status(201).json(blog);
    } catch (error) {
      if (error.code === 11000) return res.status(400).json({ message: 'Slug already exists' });
      res.status(500).json({ message: error.message });
    }
  }
);

// Admin: update blog
router.put(
  '/:id',
  authAdmin,
  [
    body('title').optional().trim().notEmpty(),
    body('excerpt').optional().isLength({ max: 200 }),
    body('status').optional().isIn(['draft', 'published']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });

      const { title, slug, coverImage, excerpt, content, author, status } = req.body;

      if (title !== undefined) blog.title = title;
      if (coverImage !== undefined) blog.coverImage = coverImage;
      if (excerpt !== undefined) blog.excerpt = excerpt;
      if (content !== undefined) blog.content = content;
      if (author !== undefined) blog.author = author;

      if (slug !== undefined && slug.trim()) {
        const baseSlug = slugify(slug);
        blog.slug = await ensureUniqueSlug(baseSlug, blog._id);
      } else if (title !== undefined && !slug) {
        const baseSlug = slugify(title);
        blog.slug = await ensureUniqueSlug(baseSlug, blog._id);
      }

      if (status !== undefined) {
        const wasPublished = blog.status === 'published';
        blog.status = status;
        if (status === 'published' && !wasPublished) {
          blog.publishedAt = new Date();
        }
        if (status === 'draft') {
          blog.publishedAt = undefined;
        }
      }

      await blog.save();
      res.json(blog);
    } catch (error) {
      if (error.code === 11000) return res.status(400).json({ message: 'Slug already exists' });
      res.status(500).json({ message: error.message });
    }
  }
);

// Admin: delete blog
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public: single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug.toLowerCase(), status: 'published' });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
