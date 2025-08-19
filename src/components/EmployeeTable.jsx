import React, { useEffect, useState } from 'react';
import avatarimg2 from '../assets/avatarimg2.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
const EmployeeTable = () => {
  const [members, setMembers] = useState([]);
  const [loading,setloading] = useState(true);
  const deleteMember = async (email) => {
    if (window.confirm(`Are you sure you want to delete the member with email: ${email}?`)) {
      try {
        const response = await fetch(`https://userinterfaceproject.vercel.app/api/deleteMemberfromTable/${email}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
  
        const result = await response.json();
        alert(result.message);
        window.location.reload()
      } catch (error) {
        console.error('Error:', error.message);
        alert('An error occurred: ' + error.message);
      }
    }
  };
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('https://userinterfaceproject.vercel.app/api/getMembers');
        setMembers(response.data);
        setloading(false);
        console.log(response.data);
      } catch (error) {
        setloading(false);
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="bg-[#F2F4F7] min-h-screen px-2 md:px-8 py-8">
      <h1 className="text-[24px] font-normal font-Manrope">Employees</h1>
      <div className="overflow-x-auto">
        <table className="bg-white w-full rounded-md mt-4 min-w-[600px]">
          <thead>
            <tr className="text-[16px] font-medium ">
              <th className="p-5 ps-12 text-left">Name</th>
              <th className="text-left">Employee Role</th>
              <th className="text-left">Phone</th>
              <th className="text-left">Level</th>
              <th className="text-left">Joined</th>
              <th className="text-left">Status</th>
              <th></th>
            </tr>
          </thead>
          
<tbody>
{loading ? (
  <tr>
    <td colSpan="6" className="text-center py-5">
      <ClipLoader size={50} color={"#123abc"} loading={loading} />
    </td>
  </tr>
) : (
  members.map((member, index) => (
    <tr className="border-t-2 border-b-2" key={index}>
      <td className="ps-12 p-2">
        <div className="flex items-center gap-3">
          <img 
            src={member.profilePicture ? `data:image/png;base64,${member.profilePicture}` : avatarimg2} 
            alt='' 
            className="h-14 w-14 rounded-full" 
          />
          <div>
            <h1 className="text-[16px] font-normal text-[#475467]">{`${member.firstName} ${member.lastName}`}</h1>
            <p className="text-[12px] font-normal text-[#4B5563]">{member.email}</p>
          </div>
        </div>
      </td>
      <td className="text-[16px] text-[#4B5563] font-normal">{member.role}</td>
      <td className="text-[16px] text-[#4B5563] font-normal">{member.phoneNumber || 'N/A'}</td>
      <td className="text-[16px] text-[#4B5563] font-normal">{member.level || 'N/A'}</td>
    
      <td className="text-[16px] text-[#4B5563] font-normal">{new Date(member.joiningDate).toLocaleDateString()}</td>
      <td>
        <span className="text-[14px] font-normal px-4 py-1 bg-[#D1FAE5] rounded-md">{member.status}</span>
      </td>
      <td>
        
      </td>
    </tr>
  ))
)}
</tbody>
        </table>
      </div>
      {/* <div className='bg-white mt-10 mb-10 py-6 px-4 flex flex-col gap-2'>
        <p className='text-[18px]'>Ready to expand the team?</p>
        <p className='text-[#6B7280] text-[14px]'>Grow your workforce by adding a hire and tracking their onboarding process</p>
        <button className='px-4 py-2 bg-blue-600 rounded-md text-white w-[200px]'><Link to='/newMember'>Add Team Member</Link></button>
      </div> */}
    </div>
  );
};

export default EmployeeTable;
