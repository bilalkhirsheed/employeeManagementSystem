import React, { useEffect, useState } from 'react';
import avatarimg2 from '../assets/avatarimg2.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
const ManageEmployee = () => {
  const [members, setMembers] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);
  const [message,setMessage]=useState('')
 const navigate = useNavigate();
  const openDeleteModal = (email) => {
    setEmailToDelete(email);
    setIsModalOpen(true); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEmailToDelete(null); // Reset state
  };

  const deleteMember = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://userinterfaceproject.vercel.app/api/deleteMemberfromTable/${emailToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      setMessage(result.message)
      setRefresh(prev => prev + 1);
      setTimeout(() => {
        setMessage('');
        navigate('/manageEmployeeboard');
      }, 2000);
    } catch (error) {
     
      console.error('Error:', error.message);
     
      setMessage(error.message)
      setTimeout(() => {
        setMessage('');
      
      }, 2000);
    } finally {
      closeModal(); // Close the modal
    }
  };

  const updateStatus = async (email, newStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`https://userinterfaceproject.vercel.app/api/updateStatus/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
    

      
      setLoading(false)
        setMessage(result.message)
        setRefresh(prev => prev + 1);
        setTimeout(() => {
          setMessage('');
          navigate('/manageEmployeeboard');
        }, 2000);
      
    } catch (error) {
    
      console.error('Error updating status:', error.message);
      setLoading(false)
        setMessage(error.message)
        setTimeout(() => {
          setMessage('');
         
        }, 2000);
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('https://userinterfaceproject.vercel.app/api/getMembers');
        setMembers(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, [refresh]);

  return (
    <div className="bg-[#F2F4F7] min-h-screen px-2 md:px-8 py-8">
      <h1 className="text-[24px] font-normal font-Manrope">Employees</h1>
      {message && <p className='absolute left-[50%] top-10 text-center w-[200px] text-white rounded-sm p-1 bg-yellow-300'>{message}</p>}
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
              <th className="text-left">Change Status</th>
              <th>Actions</th>
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
                    <select 
                      defaultValue={member.status} 
                      onChange={(e) => updateStatus(member.email, e.target.value)}>
                      <option>Not Active</option>
                      <option>Active</option>
                    </select>
                  </td>
                  <td>
                    <div className="flex gap-3 text-[18px]">
                      
                      <Link to={`/editprofile/${member.email}`}>  <span className='cursor-pointer hover:text-blue-600'> <i className="ri-edit-2-line"></i></span> </Link>   
                      <span className='cursor-pointer hover:text-blue-600' onClick={() => openDeleteModal(member.email)}> <i className="ri-delete-bin-7-line"></i></span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete the member with email: {emailToDelete}?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={deleteMember}>
                Confirm
              </button>
              <button 
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        <div className='bg-white mt-10 mb-10 py-6 px-4 flex flex-col gap-2'>
        <p className='text-[18px]'>Ready to expand the team?</p>
        <p className='text-[#6B7280] text-[14px]'>Grow your workforce by adding a hire and tracking their onboarding process</p>
        <button className='px-4 py-2 bg-blue-600 rounded-md text-white w-[200px]'><Link to='/newMember'>Add Team Member</Link></button>
      </div>
    </div>
  );
};

export default ManageEmployee;
