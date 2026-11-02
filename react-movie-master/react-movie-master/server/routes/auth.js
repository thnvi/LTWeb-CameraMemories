const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function safeMessage(err) {
  // Prefer server-side known messages; avoid leaking internals.
  if (err?.code === 11000) return 'Email đã được sử dụng';
  return 'Lỗi server';
}

// Đăng ký (user mặc định).
router.post('/register', async (req, res) => {
  try {
    const name = (req.body?.name || '').trim();
    const email = (req.body?.email || '').trim().toLowerCase();
    const password = (req.body?.password || '').toString();

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email đã được sử dụng' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role: 'user' });

    const token = signToken(user);
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('REGISTER_ERROR:', err);
    return res.status(500).json({ message: safeMessage(err) });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const email = (req.body?.email || '').trim().toLowerCase();
    const password = (req.body?.password || '').toString();

    if (!email || !password) return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });

    const token = signToken(user);
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('LOGIN_ERROR:', err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

// Tạo admin (dùng cho lần đầu) - yêu cầu ADMIN_SEED_SECRET trong .env
// POST /api/auth/seed-admin { name,email,password, secret }
router.post('/seed-admin', async (req, res) => {
  try {
    const requiredSecret = process.env.ADMIN_SEED_SECRET;
    if (!requiredSecret) {
      return res.status(500).json({ message: 'Chưa cấu hình ADMIN_SEED_SECRET trong server/.env' });
    }

    const secret = (req.body?.secret || '').toString();
    if (secret !== requiredSecret) {
      return res.status(403).json({ message: 'Sai mã tạo admin' });
    }

    const name = (req.body?.name || 'Admin').trim();
    const email = (req.body?.email || '').trim().toLowerCase();
    const password = (req.body?.password || '').toString();

    if (!email || !password) return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
    if (password.length < 6) return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });

    const existing = await User.findOne({ email });
    if (existing) {
      existing.role = 'admin';
      if (!existing.name) existing.name = name;
      await existing.save();
      const token = signToken(existing);
      return res.json({
        token,
        user: { id: existing._id, name: existing.name, email: existing.email, role: existing.role },
        note: 'Tài khoản đã tồn tại, đã nâng quyền admin',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role: 'admin' });

    const token = signToken(user);
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('SEED_ADMIN_ERROR:', err);
    return res.status(500).json({ message: safeMessage(err) });
  }
});

router.get('/me', async (req, res) => {
  const auth = require('../middleware/auth');
  return auth(req, res, async () => {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy' });
    return res.json({ user });
  });
});

module.exports = router;
