import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import { employeeAPI } from '../../services/api';
import './EmployeeList.css';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchEmployees();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll(filters);
      setEmployees(response.data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        fetchEmployees();
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        alert('Error deleting employee');
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <Navbar role="admin" />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Employee Management</h1>
          <Link to="/admin/employees/add" className="btn btn--primary">
            + Add Employee
          </Link>
        </div>

        <div className="filters-card card">
          <div className="filters-grid">
            <div className="form-group">
              <label className="form-label">Search</label>
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="Search by name, code, email..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                name="department"
                className="form-control"
                value={filters.department}
                onChange={handleFilterChange}
              >
                <option value="">All Departments</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-control"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee Code</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.employeeCode}</td>
                    <td>{employee.firstName} {employee.lastName}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>{employee.designation}</td>
                    <td>
                      <span className={`status ${
                        employee.status === 'Active' ? 'status--success' :
                        employee.status === 'Inactive' ? 'status--warning' :
                        'status--error'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => navigate(`/admin/employees/edit/${employee._id}`)}
                          className="btn btn--sm btn--secondary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="btn btn--sm btn--danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && employees.length === 0 && (
          <div className="empty-state">
            <p>No employees found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
