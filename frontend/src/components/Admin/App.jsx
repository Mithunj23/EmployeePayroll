import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Common/PrivateRoute';
import Login from './components/Common/Login';
import AdminDashboard from './components/Admin/Dashboard';
import EmployeeList from './components/Admin/EmployeeList';
import AddEmployee from './components/Admin/AddEmployee';
import PayrollManagement from './components/Admin/PayrollManagement';
import Reports from './components/Admin/Reports';
import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import PaySlip from './components/Employee/Payslip';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/employees" element={
            <PrivateRoute role="admin">
              <EmployeeList />
            </PrivateRoute>
          } />
          <Route path="/admin/employees/add" element={
            <PrivateRoute role="admin">
              <AddEmployee />
            </PrivateRoute>
          } />
          <Route path="/admin/employees/edit/:id" element={
            <PrivateRoute role="admin">
              <AddEmployee />
            </PrivateRoute>
          } />
          <Route path="/admin/payroll" element={
            <PrivateRoute role="admin">
              <PayrollManagement />
            </PrivateRoute>
          } />
          <Route path="/admin/reports" element={
            <PrivateRoute role="admin">
              <Reports />
            </PrivateRoute>
          } />

          {/* Employee Routes */}
          <Route path="/employee/dashboard" element={
            <PrivateRoute role="employee">
              <EmployeeDashboard />
            </PrivateRoute>
          } />
          <Route path="/employee/payslip/:id" element={
            <PrivateRoute role="employee">
              <PaySlip />
            </PrivateRoute>
          } />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
