const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const payrollRoutes = require('./routes/payroll');
const attendanceRoutes = require('./routes/attendanceRoutes');
const employeesRoutes = require('./routes/employees');
const reportRoutes = require('./routes/reports');  // Added reportRoutes import

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/payroll', payrollRoutes);   // Payroll routes including payslip download
app.use('/api/attendance', attendanceRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/reports', reportRoutes);    // Mounted report routes to fix 404 errors

// Root endpoint
app.get('/', (req, res) => {
  res.send('Employee Payroll Management System API is running...');
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
