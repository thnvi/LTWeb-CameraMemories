const mongoose = require('mongoose');

// Lưu “movie” theo TMDB id để bạn có thể quản lý nội dung hiển thị (featured, banner, v.v.)
const MovieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true, index: true },
    category: { type: String, enum: ['movie', 'tv'], required: true },
    title: { type: String, required: true },
    overview: { type: String, default: '' },
    posterPath: { type: String, default: '' },
    backdropPath: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

MovieSchema.index({ tmdbId: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Movie', MovieSchema);
