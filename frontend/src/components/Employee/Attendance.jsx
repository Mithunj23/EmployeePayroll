import { useEffect, useState } from 'react';
import { attendanceAPI } from '../../services/api';
import './Attendance.css';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    attendanceAPI.getAll()
      .then(response => {
        setAttendance(response.data.data);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load attendance');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading attendance data...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="attendance-container">
      <h2>Attendance Records</h2>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Hours Worked</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map(record => (
            <tr key={record._id}>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>{record.employeeId ? `${record.employeeId.firstName} ${record.employeeId.lastName}` : 'N/A'}</td>
              <td>{record.status}</td>
              <td>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : 'N/A'}</td>
              <td>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : 'N/A'}</td>
              <td>{record.hoursWorked ?? 'N/A'}</td>
              <td>{record.remarks ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
