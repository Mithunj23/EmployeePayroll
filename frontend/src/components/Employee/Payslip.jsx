import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import { payrollAPI } from '../../services/api';
import './PaySlip.css';

const formatCurrency = (amount) => `₹${amount?.toLocaleString() ?? '0'}`;
const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString() : 'Pending';

const PaySlip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPayslip = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await payrollAPI.getOne(id);
        if (isMounted) {
          setPayslip(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching payslip:', err);
        if (isMounted) {
          setPayslip(null);
          setError('Failed to load payslip. Please try again.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPayslip();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!payslip) {
    return <div>Payslip not found</div>;
  }

  const employee = payslip.employeeId || {};
  const monthName = new Date(2000, (payslip.month || 1) - 1).toLocaleString('default', {
    month: 'long',
  });

  return (
    <div>
      <Navbar role="employee" />
      <div className="container">
        <div className="payslip-actions no-print">
          <button onClick={() => navigate('/employee/dashboard')} className="btn btn--secondary">
            Back to Dashboard
          </button>
          <button onClick={handlePrint} className="btn btn--primary">
            Print Payslip
          </button>
        </div>

        <div className="payslip-container card">
          <div className="payslip-header">
            <h1>PAYSLIP</h1>
            <p className="payslip-period">
              For the month of {monthName} {payslip.year}
            </p>
          </div>

          <div className="payslip-section">
            <h3>Employee Details</h3>
            <div className="details-grid">
              <div>
                <label>Employee Code</label>
                <p>{employee.employeeCode || 'N/A'}</p>
              </div>
              <div>
                <label>Employee Name</label>
                <p>{`${employee.firstName ?? 'N/A'} ${employee.lastName ?? ''}`}</p>
              </div>
              <div>
                <label>Department</label>
                <p>{employee.department || 'N/A'}</p>
              </div>
              <div>
                <label>Designation</label>
                <p>{employee.designation || 'N/A'}</p>
              </div>
              <div>
                <label>Bank Account</label>
                <p>{employee.bankDetails?.accountNumber || 'N/A'}</p>
              </div>
              <div>
                <label>Payment Date</label>
                <p>{formatDate(payslip.paymentDate)}</p>
              </div>
            </div>
          </div>

          <div className="payslip-section">
            <h3>Attendance Details</h3>
            <div className="details-grid">
              <div>
                <label>Working Days</label>
                <p>{payslip.workingDays ?? 0}</p>
              </div>
              <div>
                <label>Present Days</label>
                <p>{payslip.presentDays ?? 0}</p>
              </div>
              <div>
                <label>Absent Days</label>
                <p>{(payslip.workingDays ?? 0) - (payslip.presentDays ?? 0)}</p>
              </div>
            </div>
          </div>

          <div className="salary-breakdown">
            <div className="breakdown-column">
              <h3>Earnings</h3>
              <table className="breakdown-table">
                <tbody>
                  <tr>
                    <td>Basic Salary</td>
                    <td>{formatCurrency(payslip.earnings?.basicSalary)}</td>
                  </tr>
                  <tr>
                    <td>HRA</td>
                    <td>{formatCurrency(payslip.earnings?.hra)}</td>
                  </tr>
                  <tr>
                    <td>DA</td>
                    <td>{formatCurrency(payslip.earnings?.da)}</td>
                  </tr>
                  <tr>
                    <td>Other Allowances</td>
                    <td>{formatCurrency(payslip.earnings?.otherAllowances)}</td>
                  </tr>
                  {payslip.earnings?.bonus > 0 && (
                    <tr>
                      <td>Bonus</td>
                      <td>{formatCurrency(payslip.earnings.bonus)}</td>
                    </tr>
                  )}
                  {payslip.earnings?.overtime > 0 && (
                    <tr>
                      <td>Overtime</td>
                      <td>{formatCurrency(payslip.earnings.overtime)}</td>
                    </tr>
                  )}
                  <tr className="total-row">
                    <td>
                      <strong>Gross Salary</strong>
                    </td>
                    <td>
                      <strong>{formatCurrency(payslip.grossSalary)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="breakdown-column">
              <h3>Deductions</h3>
              <table className="breakdown-table">
                <tbody>
                  <tr>
                    <td>Provident Fund</td>
                    <td>{formatCurrency(payslip.deductions?.pf)}</td>
                  </tr>
                  <tr>
                    <td>Tax</td>
                    <td>{formatCurrency(payslip.deductions?.tax)}</td>
                  </tr>
                  <tr>
                    <td>Insurance</td>
                    <td>{formatCurrency(payslip.deductions?.insurance)}</td>
                  </tr>
                  {payslip.deductions?.loanDeduction > 0 && (
                    <tr>
                      <td>Loan Deduction</td>
                      <td>{formatCurrency(payslip.deductions.loanDeduction)}</td>
                    </tr>
                  )}
                  {payslip.deductions?.lateDeduction > 0 && (
                    <tr>
                      <td>Late Deduction</td>
                      <td>{formatCurrency(payslip.deductions.lateDeduction)}</td>
                    </tr>
                  )}
                  <tr className="total-row">
                    <td>
                      <strong>Total Deductions</strong>
                    </td>
                    <td>
                      <strong>{formatCurrency(payslip.totalDeductions)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="net-salary-section">
            <div className="net-salary-box">
              <span className="net-salary-label">Net Salary</span>
              <span className="net-salary-amount">{formatCurrency(payslip.netSalary)}</span>
            </div>
          </div>

          <div className="payslip-footer">
            <p>This is a computer-generated payslip and does not require a signature.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaySlip;
