const express = require('express');
const router = express.Router();
const {
  getDepartmentWiseReport,
  getMonthlySummary,
  getYearlyComparison
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/department-wise', getDepartmentWiseReport);
router.get('/monthly-summary', getMonthlySummary);
router.get('/yearly-comparison', getYearlyComparison);

module.exports = router;
