require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function main() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('Missing MONGO_URI in server/.env');
    process.exit(1);
  }

  const email = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '123456';
  const name = process.env.ADMIN_NAME || 'Admin';

  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    await existing.save();
    console.log('Admin already exists. Upgraded role to admin:', email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ name, email, passwordHash, role: 'admin' });

  console.log('Created admin:', email);
  console.log('Password:', password);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
