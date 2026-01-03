import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import { employeeAPI, payrollAPI } from '../../services/api';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const employeeId = localStorage.getItem('employeeId');
      
      const [empRes, payrollRes] = await Promise.all([
        employeeAPI.getOne(employeeId),
        payrollAPI.getEmployeePayslips(employeeId)
      ]);

      setEmployee(empRes.data.data);
      setPayslips(payrollRes.data.data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const latestPayslip = payslips[0];

  return (
    <div>
      <Navbar role="employee" />
      <div className="container">
        <h1 className="page-title">Welcome, {employee?.firstName}!</h1>

        {/* Employee Info Card */}
        <div className="card">
          <div className="employee-info-grid">
            <div>
              <label>Employee Code</label>
              <p>{employee?.employeeCode}</p>
            </div>
            <div>
              <label>Department</label>
              <p>{employee?.department}</p>
            </div>
            <div>
              <label>Designation</label>
              <p>{employee?.designation}</p>
            </div>
            <div>
              <label>Email</label>
              <p>{employee?.email}</p>
            </div>
            <div>
              <label>Phone</label>
              <p>{employee?.phone}</p>
            </div>
            <div>
              <label>Status</label>
              <p>
                <span className="status status--success">{employee?.status}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Latest Payslip */}
        {latestPayslip && (
          <div className="card">
            <h3 className="section-title">Latest Salary Details</h3>
            <div className="salary-summary">
              <div className="salary-item">
                <span className="salary-label">Gross Salary</span>
                <span className="salary-value">₹{latestPayslip.grossSalary.toLocaleString()}</span>
              </div>
              <div className="salary-item">
                <span className="salary-label">Total Deductions</span>
                <span className="salary-value salary-value--negative">
                  -₹{latestPayslip.totalDeductions.toLocaleString()}
                </span>
              </div>
              <div className="salary-item salary-item--primary">
                <span className="salary-label">Net Salary</span>
                <span className="salary-value">₹{latestPayslip.netSalary.toLocaleString()}</span>
              </div>
            </div>
            <Link 
              to={`/employee/payslip/${latestPayslip._id}`}
              className="btn btn--primary"
              style={{ marginTop: '1rem' }}
            >
              View Detailed Payslip
            </Link>
          </div>
        )}

        {/* Payslip History */}
        <div className="card">
          <h3 className="section-title">Payslip History</h3>
          {payslips.length === 0 ? (
            <div className="empty-state">No payslips available</div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Working Days</th>
                    <th>Present Days</th>
                    <th>Net Salary</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payslips.map((payslip) => (
                    <tr key={payslip._id}>
                      <td>
                        {new Date(2000, payslip.month - 1).toLocaleString('default', { month: 'long' })}
                      </td>
                      <td>{payslip.year}</td>
                      <td>{payslip.workingDays}</td>
                      <td>{payslip.presentDays}</td>
                      <td><strong>₹{payslip.netSalary.toLocaleString()}</strong></td>
                      <td>
                        <span className={`status ${
                          payslip.paymentStatus === 'Paid' ? 'status--success' :
                          payslip.paymentStatus === 'Processed' ? 'status--warning' :
                          'status--error'
                        }`}>
                          {payslip.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/employee/payslip/${payslip._id}`}
                          className="btn btn--sm btn--secondary"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
