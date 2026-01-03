const express = require('express');
const router = express.Router();

const {
  generatePayroll,
  getAllPayroll,
  getPayroll,
  updatePayrollStatus,
  getEmployeePayslips,
  downloadPayslip,
} = require('../controllers/payrollController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all routes below
router.use(protect);

// Admin only routes
router.post('/generate', authorize('admin'), generatePayroll);
router.put('/:id/status', authorize('admin'), updatePayrollStatus);

// Admin & Employee routes - employees can only access their own data inside controllers
router.get('/', authorize('admin', 'employee'), getAllPayroll);
router.get('/employee/:employeeId/payslips', authorize('admin', 'employee'), getEmployeePayslips);
router.get('/:id', authorize('admin', 'employee'), getPayroll);
router.get('/:id/download', authorize('admin', 'employee'), downloadPayslip);

module.exports = router;
