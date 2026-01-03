const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware'); // fix here

// Protect all routes
router.use(protect);

// Admin can view and manage employees
router.route('/')
  .get(authorize('admin'), getAllEmployees)
  .post(authorize('admin'), createEmployee);

router.route('/:id')
  .get(authorize('admin'), getEmployee)
  .put(authorize('admin'), updateEmployee)
  .delete(authorize('admin'), deleteEmployee);

module.exports = router;
