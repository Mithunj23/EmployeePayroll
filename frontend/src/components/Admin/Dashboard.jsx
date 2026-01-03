import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import { employeeAPI, payrollAPI, attendanceAPI } from '../../services/api';  // Added attendanceAPI import
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingPayrolls: 0,
    monthlyPayroll: 0,
    totalAttendanceRecords: 0  // Added attendance
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [employeesRes, payrollRes, attendanceRes] = await Promise.all([
        employeeAPI.getAll(),
        payrollAPI.getAll({ status: 'Pending' }),
        attendanceAPI.getAll()  // Fetch all attendance records for admin
      ]);

      const employees = employeesRes?.data?.data ?? [];
      const payrolls = payrollRes?.data?.data ?? [];
      const attendanceRecords = attendanceRes?.data?.data ?? [];

      const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
      const monthlyTotal = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);

      setStats({
        totalEmployees: employees.length,
        activeEmployees,
        pendingPayrolls: payrolls.length,
        monthlyPayroll: monthlyTotal,
        totalAttendanceRecords: attendanceRecords.length  // Set attendance count
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar role="admin" />
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card stat-card--primary">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalEmployees}</div>
              <div className="stat-label">Total Employees</div>
            </div>
          </div>

          <div className="stat-card stat-card--success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.activeEmployees}</div>
              <div className="stat-label">Active Employees</div>
            </div>
          </div>

          <div className="stat-card stat-card--warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.pendingPayrolls}</div>
              <div className="stat-label">Pending Payrolls</div>
            </div>
          </div>

          <div className="stat-card stat-card--info">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">₹{stats.monthlyPayroll.toLocaleString()}</div>
              <div className="stat-label">Monthly Payroll</div>
            </div>
          </div>

          {/* New attendance stat card */}
          <div className="stat-card stat-card--purple">
            <div className="stat-icon">🗓️</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalAttendanceRecords}</div>
              <div className="stat-label">Attendance Records</div>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="action-grid">
            <Link to="/admin/employees/add" className="action-card">
              <span className="action-icon">➕</span>
              <span className="action-title">Add Employee</span>
            </Link>

            <Link to="/admin/payroll" className="action-card">
              <span className="action-icon">💵</span>
              <span className="action-title">Generate Payroll</span>
            </Link>

            <Link to="/admin/employees" className="action-card">
              <span className="action-icon">📋</span>
              <span className="action-title">View Employees</span>
            </Link>

            <Link to="/admin/reports" className="action-card">
              <span className="action-icon">📊</span>
              <span className="action-title">View Reports</span>
            </Link>

            {/* New attendance action link */}
            <Link to="/admin/attendance" className="action-card">
              <span className="action-icon">📅</span>
              <span className="action-title">View Attendance</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
