const express = require('express');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const router = express.Router();

// Public: lấy danh sách phim bạn lưu trong DB (ví dụ: featured)
router.get('/', async (req, res) => {
  const { featured } = req.query;
  const filter = {};
  if (featured === 'true') filter.isFeatured = true;
  const movies = await Movie.find(filter).sort({ updatedAt: -1 }).limit(50);
  return res.json({ movies });
});

// Admin: thêm phim vào DB
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { tmdbId, category, title, overview, posterPath, backdropPath, isFeatured } = req.body;
    if (!tmdbId || !category || !title) return res.status(400).json({ message: 'Missing fields' });

    const movie = await Movie.create({
      tmdbId,
      category,
      title,
      overview: overview || '',
      posterPath: posterPath || '',
      backdropPath: backdropPath || '',
      isFeatured: !!isFeatured,
      createdBy: req.user.id,
    });

    return res.status(201).json({ movie });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Movie already exists' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: cập nhật
router.put('/:id', auth, adminOnly, async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!movie) return res.status(404).json({ message: 'Not found' });
  return res.json({ movie });
});

// Admin: xoá
router.delete('/:id', auth, adminOnly, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Not found' });
  return res.json({ ok: true });
});

module.exports = router;
