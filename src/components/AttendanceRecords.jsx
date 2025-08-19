import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // Import the loader

const AttendanceRecords = () => {
  const { memberId } = useParams(); // Get memberId from the URL
  const [records, setRecords] = useState([]);
  const [memberInfo, setMemberInfo] = useState({ name: '', email: '' });
  const [totalPresent, setTotalPresent] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [loading, setLoading] = useState(true); // Loading state

  // Get current year
  const currentYear = new Date().getFullYear();

  // Create an array of months (1-12) and years for the dropdown
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, ..., 12]
  const years = Array.from({ length: currentYear - 2022 }, (_, i) => 2023 + i); // Years from 2023 to current year

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const memberResponse = await axios.get(`https://userinterfaceproject.vercel.app/api/getmembers`);
        const member = memberResponse.data.find(m => m.id === parseInt(memberId));

        if (member) {
          setMemberInfo({
            name: `${member.firstName} ${member.lastName}`,
            email: member.email,
          });
        }
      } catch (error) {
        console.error('Error fetching member info:', error);
      }
    };

    const fetchRecords = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.get(`https://userinterfaceproject.vercel.app/api/attendance/${selectedMonth}/${selectedYear}/${memberId}`);
        const attendanceRecords = response.data;

        const presentCount = attendanceRecords.filter(record => record.status === 'Checked In').length;
        setTotalPresent(presentCount);
        setRecords(attendanceRecords);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchMemberInfo();
    fetchRecords();
  }, [memberId, selectedMonth, selectedYear]);

  // Generate an array of days for the selected month
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-4">
          <h2 className="text-2xl font-semibold leading-tight text-gray-800 mb-6">Attendance Records</h2>

          {/* Display member's name and email */}
          <div className="mb-4">
            <p><strong>Name:</strong> {memberInfo.name}</p>
            <p><strong>Email:</strong> {memberInfo.email}</p>
          </div>

          {/* Month and Year Dropdown */}
          <div className="flex mb-6">
            <div className="mr-4">
              <label htmlFor="month" className="block text-gray-700 font-bold mb-2">Select Month</label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))} // Convert value to number
                className="border rounded py-2 px-3 text-gray-700"
              >
                {months.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year" className="block text-gray-700 font-bold mb-2">Select Year</label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))} // Convert value to number
                className="border rounded py-2 px-3 text-gray-700"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Attendance</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {loading ? ( // Show loader while loading
                  <tr>
                    <td colSpan="2" className="text-center py-3"><ClipLoader color="#3498db" loading={loading} size={30} /></td>
                  </tr>
                ) : (
                  // If no records found for the month
                  records.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center py-3 text-red-500">No records found for this month.</td>
                    </tr>
                  ) : (
                    daysArray.map((day) => {
                      const date = new Date(selectedYear, selectedMonth - 1, day);
                      const record = records.find((r) => new Date(r.attendanceDate).getDate() === day);

                      // Only return a row if the record exists and its status is 'Checked In'
                      if (record && record.status === 'Checked In') {
                        return (
                          <tr key={day} className="hover:bg-gray-100 border-b">
                            <td className="py-3 px-4">{date.toLocaleDateString()}</td>
                            <td className="py-3 px-4 font-semibold">Present</td>
                          </tr>
                        );
                      }

                      // Return null if no record or status is not 'Checked In'
                      return null;
                    })
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Total Attendance Count */}
          <div className="mt-4">
            <p><strong>Total Present Days:</strong> {totalPresent}</p>
            <p><strong>Total Days in Month:</strong> {daysInMonth}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecords;
