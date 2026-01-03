const User = require('../models/User');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

// Generate JWT Token with user id and role for proper auth and role check
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      employeeId: user.employeeId || null
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Register User (admin or employee)
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, employeeId } = req.body;

    // Check if user already exists (username or email)
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate employee exists if role is employee
    if (role === 'employee' && employeeId) {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
      employeeId: role === 'employee' ? employeeId : null
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User (admin or employee)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).populate('employeeId');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        token: generateToken(user)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Current User info (protected route)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('employeeId');
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
