import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners'; // Import spinner component

const Attendance = () => {
    const [members, setMembers] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
    const [year, setYear] = useState(new Date().getFullYear()); // Current year
    const [message, setMessage] = useState('');
    const [checkout,setCheckout]=useState(false)
    // Fetch members and attendance data
    useEffect(() => {
        const fetchMembers = async () => {
            const response = await axios.get('https://userinterfaceproject.vercel.app/api/getMembers');
            setMembers(response.data);
        };

        const fetchAttendanceData = async () => {
            setLoading(true); // Set loading to true when fetching
            const response = await axios.get(`https://userinterfaceproject.vercel.app/api/attendance/${month}/${year}`);
            setAttendanceData(response.data);
            setLoading(false); // Set loading to false after fetching
        };

        fetchMembers();
        fetchAttendanceData();
    }, [month, year,checkout]); // Re-fetch attendance when month or year changes

    const daysInMonth = new Date(year, month, 0).getDate();

    const handleAttendanceChange = async (memberId, dayIndex, checked, memberName) => {
        // Construct the correct date from the selected month, year, and day
        const attendanceDate = `${year}-${String(month).padStart(2, '0')}-${String(dayIndex + 1).padStart(2, '0')}`; // YYYY-MM-DD format

        if (checked) {
            // Handle check-in
            await axios.post('https://userinterfaceproject.vercel.app/api/attendance/add', {
                memberId,
                attendanceDate,
                status: 'Checked In'
            });
            setMessage(`Checked In ${memberName} on ${attendanceDate}`);
        } else {
            // Handle check-out
            await axios.post('https://userinterfaceproject.vercel.app/api/attendance/checkout', {
                memberId,
                attendanceDate,
                status: 'Checked Out'
            });
            setMessage(`Checked Out ${memberName} on ${attendanceDate}`);
            setCheckout(!checkout);
        }

        setTimeout(() => {
            setMessage('');
        }, 2000);
    };

    return (
        <div className="container mx-auto my-8">
            <h1 className="text-center text-3xl font-bold mb-5">Attendance Management</h1>
            {message && <p className='fixed bg-yellow-400 left-[40%] text-white max-w-[300px] text-center top-10 w-full'>{message}</p>}
            
            {/* Month/Year selector */}
            <div className="flex justify-center mb-5">
                <select className="mx-2 p-2 border border-gray-300 rounded" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                    {[...Array(12)].map((_, index) => (
                        <option key={index} value={index + 1}>{index + 1}</option>
                    ))}
                </select>
                <select className="mx-2 p-2 border border-gray-300 rounded" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                    {[2023, 2024].map((yearOption) => (
                        <option key={yearOption} value={yearOption}>{yearOption}</option>
                    ))}
                </select>
            </div>

            {/* Attendance Table */}
            {loading ? (
                <div className="flex justify-center my-4">
                    <ClipLoader loading={loading} size={50} />
                </div>
            ) : (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">Member ID</th>
                            <th className="border px-4 py-2">Name</th>
                            {[...Array(daysInMonth)].map((_, index) => (
                                <th key={index} className="border px-4 py-2">{index + 1}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td className="border px-4 py-2">{member.id}</td>
                                <td className="border px-4 py-2">{`${member.firstName} ${member.lastName}`}</td>
                                {[...Array(daysInMonth)].map((_, dayIndex) => {
                                    const attendanceDate = `${year}-${String(month).padStart(2, '0')}-${String(dayIndex + 1).padStart(2, '0')}`;

                                    // Format the backend attendanceDate to 'YYYY-MM-DD'
                                    const attendance = attendanceData.find(a =>
                                        new Date(a.attendanceDate).toISOString().slice(0, 10) === attendanceDate && 
                                        a.memberId === member.id
                                    );
                                    
                                    return (
                                        <td key={dayIndex} className="border px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={attendance && attendance.status === 'Checked In'}
                                                onChange={(e) => handleAttendanceChange(member.id, dayIndex, e.target.checked, member.firstName)}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Attendance;
