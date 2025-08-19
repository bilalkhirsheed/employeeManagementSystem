import React, { useEffect, useState } from 'react';
import { useNavigate,  useParams } from 'react-router-dom';
import profilePicture from '../assets/profileimg.jpeg';
import { ClipLoader } from 'react-spinners';

const Profile = () => {
  const { email } = useParams();
  const [loading,setLoading]=useState(true);
  const navigate = useNavigate();
  const [member, setMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    level: '',
    profilePicture: profilePicture // Default profile picture
  });
    const [message,setMessage] =useState('')
  const [editMode, setEditMode] = useState(false); // State for edit mode

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await fetch(`https://userinterfaceproject.vercel.app/api/getMemberByEmail/${email}`);
        const data = await response.json();
        setMember({
          ...data,
          profilePicture: data.profilePicture ? `data:image/jpeg;base64,${data.profilePicture}` : profilePicture
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching member data:', error);
      }
    };

    fetchMemberData();
  }, [email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setMember({ ...member, profilePicture: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://userinterfaceproject.vercel.app/api/updateMember/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(member)
      });
      const data = await response.json();
      console.log(data);
      setEditMode(false); 
      setLoading(false);
      setMessage('Member Edit successfully')
      setTimeout(() => {
        navigate('/EmployeeList')
      setMessage('');
    
 }, 2000);
     
    } catch (error) {
      console.error('Error updating member:', error);
      setLoading(false);
      setMessage('Updation Failed')
      setTimeout(() => {
       
      setMessage('');
    
 }, 2000);
    }
  };

  return (
    <div className="bg-[#F2F4F7] min-h-screen p-4">
      <h1 className="font-normal text-[24px] text-[#222222] ps-5">User Profile</h1>
      {message && <p className='fixed left-[50%] top-10 text-center w-[300px] text-white rounded-sm p-1 bg-yellow-300'>{message}</p>}
      { loading? <div className='flex items-center text-blue-400 mt-[50px] justify-center'>
       <ClipLoader/>
      </div>:
      <div className="flex flex-col lg:flex-row gap-8 flex-wrap">
        <div className="bg-white shadow-xl rounded-lg lg:w-[25%] w-full ml-0 md:ml-4 mt-4 lg:mt-0">
          <div className="p-4 flex flex-col text-center items-center text-[#4B4B4B] text-[16px]">
            <img src={member.profilePicture} className="w-[173px] h-[173px] rounded-full border-2 border-red-400 p-1" alt="Profile" />
            <h3 className="font-bold py-4">{member.firstName} {member.lastName}</h3>
          </div>

          <div className="flex flex-col gap-4 text-center border-t-2 m-2 border-[#D9E6F7] p-4">
            <span><i className="ri-user-line"> {member.role}</i></span>
            <span><i className="ri-prohibited-2-line"> {member.level}</i></span>
          </div>

          <div className="flex flex-col gap-3 text-center border-t-2 m-2 border-[#D9E6F7] p-4">
            <span><i className="ri-user-add-line"> {member.phoneNumber}</i></span>
            <span><i className="ri-mail-line"> {member.email}</i></span>
          </div>
        </div>

        <div className="bg-white rounded-lg lg:w-[50%] w-full p-10 mt-4 lg:mt-0">
          <h1 className="text-[30px] text-[#0E2040] font-semibold">Edit Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
              <p>First Name</p>
              <input type="text" name="firstName" placeholder="Yash" className="border-t-0 w-full" value={member.firstName} onChange={handleInputChange} />
            </div>
            
            <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
              <p>Last name</p>
              <input type="text" name="lastName" placeholder="Ghori" className="border-t-0 w-full" value={member.lastName} onChange={handleInputChange} />
            </div>

            <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
              <p>Email</p>
              <input type="text" name="email" placeholder="Yghori@asite.com" className="border-t-0 w-full" value={member.email} readOnly />
            </div>

            <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
              <p>Phone Number</p>
              <input type="text" name="phoneNumber" placeholder="1234567890" className="border-t-0 w-full" value={member.phoneNumber} onChange={handleInputChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
              <p>Role</p>
              <input type="text" name="role" placeholder="UI Intern" className="border-t-0 w-full" value={member.role} onChange={handleInputChange} />
            </div>
            
            <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
              <p>Level</p>
              <input type="text" name="level" placeholder="Junior" className="border-t-0 w-full" value={member.level} onChange={handleInputChange} />
            </div>

            <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
              <p>Profile Picture</p>
              <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
            </div>
          </div>

          <button onClick={handleSave} className="bg-[#6364F1] text-white py-2 px-4 rounded mt-6">Save Changes</button>
        </div>
      </div>}
      
    </div>
  );
};

export default Profile;
