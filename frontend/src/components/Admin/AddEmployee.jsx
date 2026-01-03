import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import { employeeAPI } from '../../services/api';
import './AddEmployee.css';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    department: 'IT',
    designation: '',
    dateOfJoining: '',
    employmentType: 'Full-time',
    basicSalary: '',
    hra: '',
    da: '',
    otherAllowances: '',
    pf: '',
    tax: '',
    insurance: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    branch: '',
    status: 'Active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchEmployee();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await employeeAPI.getOne(id);
      const emp = response.data.data;
      
      setFormData({
        employeeCode: emp.employeeCode,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        phone: emp.phone,
        dateOfBirth: emp.dateOfBirth?.split('T')[0] || '',
        gender: emp.gender,
        department: emp.department,
        designation: emp.designation,
        dateOfJoining: emp.dateOfJoining?.split('T')[0] || '',
        employmentType: emp.employmentType,
        basicSalary: emp.salary.basicSalary,
        hra: emp.salary.hra,
        da: emp.salary.da,
        otherAllowances: emp.salary.otherAllowances,
        pf: emp.deductions.pf,
        tax: emp.deductions.tax,
        insurance: emp.deductions.insurance,
        accountNumber: emp.bankDetails?.accountNumber || '',
        bankName: emp.bankDetails?.bankName || '',
        ifscCode: emp.bankDetails?.ifscCode || '',
        branch: emp.bankDetails?.branch || '',
        status: emp.status
      });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Error fetching employee data');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const employeeData = {
      employeeCode: formData.employeeCode,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      department: formData.department,
      designation: formData.designation,
      dateOfJoining: formData.dateOfJoining,
      employmentType: formData.employmentType,
      salary: {
        basicSalary: parseFloat(formData.basicSalary),
        hra: parseFloat(formData.hra) || 0,
        da: parseFloat(formData.da) || 0,
        otherAllowances: parseFloat(formData.otherAllowances) || 0
      },
      deductions: {
        pf: parseFloat(formData.pf) || 0,
        tax: parseFloat(formData.tax) || 0,
        insurance: parseFloat(formData.insurance) || 0
      },
      bankDetails: {
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        ifscCode: formData.ifscCode,
        branch: formData.branch
      },
      status: formData.status
    };

    try {
      if (isEdit) {
        await employeeAPI.update(id, employeeData);
      } else {
        await employeeAPI.create(employeeData);
      }
      navigate('/admin/employees');
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar role="admin" />
      <div className="container">
        <h1 className="page-title">{isEdit ? 'Edit Employee' : 'Add Employee'}</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="employee-form">
          {/* Personal Information */}
          <div className="card">
            <h3 className="section-title">Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Employee Code *</label>
                <input
                  type="text"
                  name="employeeCode"
                  className="form-control"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  required
                  disabled={isEdit}
                />
              </div>

              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="form-control"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select
                  name="gender"
                  className="form-control"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="card">
            <h3 className="section-title">Employment Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Designation *</label>
                <input
                  type="text"
                  name="designation"
                  className="form-control"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Joining *</label>
                <input
                  type="date"
                  name="dateOfJoining"
                  className="form-control"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Employment Type *</label>
                <select
                  name="employmentType"
                  className="form-control"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status *</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary Structure */}
          <div className="card">
            <h3 className="section-title">Salary Structure</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Basic Salary *</label>
                <input
                  type="number"
                  name="basicSalary"
                  className="form-control"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">HRA</label>
                <input
                  type="number"
                  name="hra"
                  className="form-control"
                  value={formData.hra}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">DA</label>
                <input
                  type="number"
                  name="da"
                  className="form-control"
                  value={formData.da}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Other Allowances</label>
                <input
                  type="number"
                  name="otherAllowances"
                  className="form-control"
                  value={formData.otherAllowances}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <h4 className="subsection-title">Deductions</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">PF</label>
                <input
                  type="number"
                  name="pf"
                  className="form-control"
                  value={formData.pf}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tax</label>
                <input
                  type="number"
                  name="tax"
                  className="form-control"
                  value={formData.tax}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Insurance</label>
                <input
                  type="number"
                  name="insurance"
                  className="form-control"
                  value={formData.insurance}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="card">
            <h3 className="section-title">Bank Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  className="form-control"
                  value={formData.accountNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  className="form-control"
                  value={formData.bankName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  className="form-control"
                  value={formData.ifscCode}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Branch</label>
                <input
                  type="text"
                  name="branch"
                  className="form-control"
                  value={formData.branch}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => navigate('/admin/employees')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
