import { useState, useEffect } from 'react';
import Navbar from '../Common/Navbar';
import { employeeAPI, payrollAPI } from '../../services/api';
import './PayrollManagement.css';

const PayrollManagement = () => {
  // Initialize state arrays as empty arrays
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch employees and payrolls when month or year changes
  useEffect(() => {
    fetchEmployees();
    fetchPayrolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll({ status: 'Active' });
      setEmployees(response?.data?.data ?? []); // Safe fallback to empty array
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
      setMessage({ type: 'error', text: 'Failed to load employees' });
    }
  };

  const fetchPayrolls = async () => {
    try {
      const response = await payrollAPI.getAll({ month, year });
      setPayrolls(response?.data?.data ?? []); // Safe fallback to empty array
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      setPayrolls([]);
      setMessage({ type: 'error', text: 'Failed to load payrolls' });
    }
  };

  const handleGeneratePayroll = async () => {
    if (!selectedEmployee) {
      setMessage({ type: 'error', text: 'Please select an employee' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await payrollAPI.generate({
        employeeId: selectedEmployee,
        month: parseInt(month, 10),
        year: parseInt(year, 10),
      });

      setMessage({ type: 'success', text: 'Payroll generated successfully' });
      setSelectedEmployee('');
      await fetchPayrolls();
    } catch (error) {
      console.error('Error generating payroll:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error generating payroll',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (payrollId, status) => {
    setLoading(true);
    try {
      await payrollAPI.updateStatus(payrollId, {
        paymentStatus: status,
        paymentDate: status === 'Paid' ? new Date() : null,
      });

      setMessage({ type: 'success', text: 'Status updated successfully' });
      await fetchPayrolls();
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage({ type: 'error', text: 'Error updating status' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPayslip = async (payrollId) => {
    try {
      const response = await payrollAPI.downloadPayslip(payrollId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payslip_${payrollId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to download payslip' });
      console.error('Failed to download payslip:', error);
    }
  };

  return (
    <div>
      <Navbar role="admin" />
      <div className="container">
        <h1 className="page-title">Payroll Management</h1>

        {message.text && (
          <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
            {message.text}
          </div>
        )}

        <div className="card">
          <h3 className="section-title">Generate Payroll</h3>
          <div className="payroll-form">
            <div className="form-group">
              <label className="form-label">Employee</label>
              <select
                className="form-control"
                value={selectedEmployee}
                disabled={loading}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeCode} - {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Month</label>
              <select
                className="form-control"
                value={month}
                disabled={loading}
                onChange={(e) => setMonth(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Year</label>
              <select
                className="form-control"
                value={year}
                disabled={loading}
                onChange={(e) => setYear(e.target.value)}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const y = new Date().getFullYear() - i;
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>

            <button onClick={handleGeneratePayroll} className="btn btn--primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Payroll'}
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">
            Payroll Records - {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })} {year}
          </h3>

          {payrolls.length === 0 ? (
            <div className="empty-state">No payroll records found for this period</div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Working Days</th>
                    <th>Present Days</th>
                    <th>Gross Salary</th>
                    <th>Deductions</th>
                    <th>Net Salary</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map(payroll => {
                    const employee = payroll.employeeId || {};
                    return (
                      <tr key={payroll._id}>
                        <td>
                          {employee.firstName && employee.lastName ? (
                            <>
                              {employee.firstName} {employee.lastName}
                              <br />
                              <small style={{ color: 'var(--color-text-secondary)' }}>
                                {employee.employeeCode}
                              </small>
                            </>
                          ) : (
                            'Employee data not available'
                          )}
                        </td>
                        <td>{employee.department || 'N/A'}</td>
                        <td>{payroll.workingDays}</td>
                        <td>{payroll.presentDays}</td>
                        <td>₹{payroll.grossSalary.toLocaleString()}</td>
                        <td>₹{payroll.totalDeductions.toLocaleString()}</td>
                        <td><strong>₹{payroll.netSalary.toLocaleString()}</strong></td>
                        <td>
                          <span
                            className={`status ${
                              payroll.paymentStatus === 'Paid'
                                ? 'status--success'
                                : payroll.paymentStatus === 'Processed'
                                ? 'status--warning'
                                : 'status--error'
                            }`}
                          >
                            {payroll.paymentStatus}
                          </span>
                        </td>
                        <td>
                          {payroll.paymentStatus === 'Pending' && (
                            <button
                              onClick={() => handleUpdateStatus(payroll._id, 'Processed')}
                              className="btn btn--sm btn--secondary"
                            >
                              Process
                            </button>
                          )}
                          {payroll.paymentStatus === 'Processed' && (
                            <button
                              onClick={() => handleUpdateStatus(payroll._id, 'Paid')}
                              className="btn btn--sm btn--primary"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            onClick={() => handleDownloadPayslip(payroll._id)}
                            className="btn btn--sm btn--download"
                            style={{ marginLeft: '8px' }}
                          >
                            Download Payslip
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollManagement;
