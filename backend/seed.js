const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Adjust path as needed
const connectDB = require('./config/db'); // Adjust path as needed

dotenv.config();
connectDB();

const createInitialUsers = async () => {
  try {
    // Check if admin already exists
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        username: 'admin1',
        email: 'admin1@payroll.com',
        password: 'admin@123', // Ensure password hashing in User model
        role: 'admin'
      });
      console.log('Admin user created:', admin.email);
    } else {
      console.log('Admin user already exists:', admin.email);
    }

    // Check if regular user already exists
    let user = await User.findOne({ role: 'employee' });
    if (!user) {
      user = await User.create({
        username: 'user1',
        email: 'user1@payroll.com',
        password: 'user@123', // Ensure password hashing in User model
        role: 'employee'
      });
      console.log('Employee user created:', user.email);
    } else {
      console.log('Employee user already exists:', user.email);
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createInitialUsers();
