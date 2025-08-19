import React from 'react';
import { FaBriefcase, FaUsers, FaUserShield, FaCheckCircle, FaFileAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SubadminNavbar = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome to SubAdmin Dashboard</h2>
        <div className="flex p-10 justify-center space-x-4">
         
        
          <Link to='/manageEmployeeboard'>
            <div className="flex items-center cursor-pointer justify-center p-4 w-40 h-40 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 shadow-lg transition duration-300">
              <div className="text-center flex flex-col gap-2 items-center justify-center">
                <FaUsers size={40} className="text-white" />
                <p className="text-white font-bold mt-2">Manage Employee</p>
              </div>
            </div>
          </Link>  
          
          
           
          <Link to='/attendance'>
            <div className="flex items-center cursor-pointer justify-center p-4 w-40 h-40 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 shadow-lg transition duration-300">
              <div className="text-center flex flex-col gap-2 items-center justify-center">
                <FaCheckCircle size={40} className="text-white" />
                <p className="text-white font-bold mt-2">Manage Attendance</p>
              </div>
            </div>
          </Link>  
          
          <Link to='/checkrecord'>
            <div className="flex items-center cursor-pointer justify-center p-4 w-40 h-40 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 shadow-lg transition duration-300">
              <div className="text-center flex flex-col gap-2 items-center justify-center">
                <FaFileAlt size={40} className="text-white" />
                <p className="text-white font-bold mt-2">Generate Report</p>
              </div>
            </div>
          </Link>  
        </div>
      </div>
    </div>
  );
};

export default SubadminNavbar;
