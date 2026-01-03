const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  markAttendance,
  getAttendanceByEmployee,
  getAllAttendance
} = require('../controllers/attendanceController');

// ✅ Protect all routes
router.use(protect);

// ✅ Admin can view all attendance
router.get('/', authorize('admin'), getAllAttendance);

// ✅ Mark attendance (both admin or self)
router.post('/mark', markAttendance);

// ✅ Get specific employee attendance
router.get('/employee', getAttendanceByEmployee);

module.exports = router; // ✅ THIS LINE IS CRITICAL
