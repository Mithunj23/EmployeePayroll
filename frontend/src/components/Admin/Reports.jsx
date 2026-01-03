import { useState, useEffect } from 'react';
import Navbar from '../Common/Navbar';
import { reportAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './Reports.css';

const Reports = () => {
  const [departmentReport, setDepartmentReport] = useState([]);
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [yearlyReport, setYearlyReport] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  const fetchReports = async () => {
    try {
      const [deptRes, monthlyRes, yearlyRes] = await Promise.all([
        reportAPI.getDepartmentWise({ month: selectedMonth, year: selectedYear }),
        reportAPI.getMonthlySummary({ year: selectedYear }),
        reportAPI.getYearlyComparison()
      ]);

      setDepartmentReport(deptRes.data.data);
      setMonthlyReport(monthlyRes.data.data.map(item => ({
        ...item,
        monthName: new Date(2000, item.month - 1).toLocaleString('default', { month: 'short' })
      })));
      setYearlyReport(yearlyRes.data.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
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
        <h1 className="page-title">Payroll Reports</h1>

        {/* Filters */}
        <div className="card">
          <div className="filters-grid">
            <div className="form-group">
              <label className="form-label">Month</label>
              <select
                className="form-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
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
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const y = new Date().getFullYear() - i;
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Department-wise Report */}
        <div className="card">
          <h3 className="section-title">Department-wise Salary Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentReport}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalNetSalary" fill="var(--color-primary)" name="Net Salary" />
            </BarChart>
          </ResponsiveContainer>

          <div className="table-container" style={{ marginTop: '1rem' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Gross Salary</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {departmentReport.map((dept) => (
                  <tr key={dept.department}>
                    <td>{dept.department}</td>
                    <td>{dept.employeeCount}</td>
                    <td>₹{dept.totalGrossSalary.toLocaleString()}</td>
                    <td>₹{dept.totalDeductions.toLocaleString()}</td>
                    <td><strong>₹{dept.totalNetSalary.toLocaleString()}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="card">
          <h3 className="section-title">Monthly Salary Trends - {selectedYear}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyReport}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalNetSalary" stroke="var(--color-primary)" name="Net Salary" />
              <Line type="monotone" dataKey="totalDeductions" stroke="var(--color-error)" name="Deductions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Yearly Comparison */}
        <div className="card">
          <h3 className="section-title">Year-on-Year Comparison</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Employees</th>
                  <th>Total Gross Salary</th>
                  <th>Total Net Salary</th>
                  <th>Growth</th>
                </tr>
              </thead>
              <tbody>
                {yearlyReport.map((year, index) => {
                  const prevYear = yearlyReport[index - 1];
                  const growth = prevYear 
                    ? ((year.totalNetSalary - prevYear.totalNetSalary) / prevYear.totalNetSalary * 100).toFixed(2)
                    : 0;

                  return (
                    <tr key={year.year}>
                      <td><strong>{year.year}</strong></td>
                      <td>{year.employeeCount}</td>
                      <td>₹{year.totalGrossSalary.toLocaleString()}</td>
                      <td>₹{year.totalNetSalary.toLocaleString()}</td>
                      <td>
                        {index > 0 && (
                          <span className={`status ${growth >= 0 ? 'status--success' : 'status--error'}`}>
                            {growth >= 0 ? '+' : ''}{growth}%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
