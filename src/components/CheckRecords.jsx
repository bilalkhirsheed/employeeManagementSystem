import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

const CheckRecords = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('https://userinterfaceproject.vercel.app/api/getMembers');
        setMembers(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setLoading(true); // Set loading to true
      try {
        const response = await fetch(`https://userinterfaceproject.vercel.app/api/searchEmployee?searchTerm=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        if (response.ok) {
          setSearchResults(data);
          setErrorMessage(''); // Clear any previous error messages
        } else {
          setErrorMessage(data.message); // Set error message from response
          setSearchResults([]); // Clear search results if not found
        }

        setPopupVisible(true); // Show popup
      } catch (error) {
        console.error('Error searching for employees:', error);
        setErrorMessage('Error searching for employees.');
        setSearchResults([]);
      } finally {
        setLoading(false); // Set loading to false
      }
    }
  };

  return (
    <div className="bg-[#F2F4F7] min-h-screen px-2 md:px-8 py-8 relative">
      <h1 className="text-[24px] font-normal font-Manrope">Employees</h1>
      
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="border outline-none p-2 w-full rounded-md"
          placeholder="Search for an employee by name ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch} // Trigger search on Enter
        />
      </div>

      {/* Table */}
      <div className={`overflow-x-auto transition-opacity ${popupVisible ? 'opacity-50' : 'opacity-100'}`}>
        <table className="bg-white w-full rounded-md mt-4 min-w-[600px]">
          <thead>
            <tr className="text-[16px] font-medium">
              <th className="p-5 ps-12 text-left">Name</th>
              <th className="text-left">Email</th>
              <th className="text-left">Role</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-5">
                  <ClipLoader size={50} color={"#123abc"} loading={loading} />
                </td>
              </tr>
            ) : (
              (searchResults.length > 0 ? searchResults : members).map((member, index) => (
                <tr className="border-t-2 py-2 border-b-2" key={index}>
                  <td className="ps-12 p-2">
                    <div className="text-[16px] font-normal text-[#475467]">{`${member.firstName} ${member.lastName}`}</div>
                  </td>
                  <td className="text-[16px] text-[#4B5563] font-normal">{member.email}</td>
                  <td className="text-[16px] text-[#4B5563] font-normal">{member.role}</td>
                  <td className='py-2 flex gap-4'>
                    <Link to={`/attendance/records/${member.id}`}>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        Attendance Record
                      </button>
                    </Link>   
                    <Link to={`/attendancereport/${member.id}`}>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        generate Report
                      </button>
                    </Link>   
                  </td>
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {popupVisible && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
          
          {/* Search Results Popup */}
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <div className="bg-white p-6 border rounded-md shadow-lg max-w-2xl w-full">
              {errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
              ) : searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((result) => (
                    <li key={result.id} className="p-2 border-b flex items-center">
                      {result.firstName} {result.lastName} - {result.email}
                      <Link to={`/attendance/records/${result.id}`}>
                        <button className="bg-blue-500 text-white px-4 py-2 ml-4 rounded-md">
                          Attendance Record
                        </button>
                      </Link>
                      <Link to={`/attendancereport/${result.id}`}>
                        <button className="bg-blue-500 text-white px-4 py-2 ml-4 rounded-md">
                          Generate Report 
                        </button>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No employees found.</p>
              )}
              <button
                className="bg-red-500 text-white p-2 mt-4 rounded-md"
                onClick={() => setPopupVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckRecords;
