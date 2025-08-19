import React,{ useState, useRef } from 'react'
import profilePicture1 from '../assets/imageIcon.jpg'
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
const AddNewMemberForm = () => {

    const [profilePicture, setProfilePicture] = useState(profilePicture1); // Replace with your default image
  const [loading,setloading]=useState(false)
  const [message,setMessage]=useState('')
  const navigate= useNavigate();
    const [formData,setFormData]=useState({
        firstName:'',
        lastName:'',
        email:'',
        role:'',
        level:'',
        joiningDate:''

    })
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const checkMemberExistence = async (email) => {
    try {
      const response = await fetch(`https://userinterfaceproject.vercel.app/api/check-member/${email}`);
      const result = await response.json();
    
      return result.exists;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    const { firstName, lastName, email, phoneNumber, password, confirmPassword, role,level, joiningDate } = formData;
  
   
    const memberExists = await checkMemberExistence(email); // Await the result
    if (memberExists) {
      setMessage('Email Already Exist')
      setTimeout(() => {
        setMessage('');
       
      }, 2000);
      setloading(false);
      return;
    }
  
    const data = {
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      level,
      joiningDate,
      profilePicture
    };
  
    try {
      const response = await fetch('https://userinterfaceproject.vercel.app/api/new-member', { // Updated port if backend runs on 3000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      setloading(false);
     
      setMessage(result.message)
      setTimeout(() => {
        setMessage('');
        navigate('/manageEmployeeboard');
      }, 2000);
    } catch (error) {
        setloading(false);
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="bg-[#F2F4F7] min-h-screen p-4">
    <h1 className="font-normal text-[24px] text-[#222222] px-5">New Member</h1>
  {message && <p className='fixed left-[50%] top-10 text-center w-[300px] text-white rounded-sm p-1 bg-yellow-300'>{message}</p>}
    <div className="flex flex-col lg:flex-row gap-8 flex-wrap">
      <div className="bg-white shadow-xl rounded-lg lg:w-[25%] w-full ml-0 md:ml-4 mt-4 lg:mt-0">
      <div className="p-4 flex flex-col text-center items-center text-[#4B4B4B] text-[16px]">
        <img
          src={profilePicture}
          className="w-[173px] h-[173px] rounded-full border-2 border-red-400 p-1 cursor-pointer"
          alt="Profile"
          onClick={handleImageClick}
          onChange={handleImageChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

        

      
      </div>

      <div className="bg-white rounded-lg lg:w-[50%] w-full p-10 mt-4 lg:mt-0">
        <h1 className="text-[30px] text-[#0E2040] font-semibold">Add New Member</h1>
<form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        
          <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
            <p>First Name</p>
            <input type="text" value={formData.firstName} name='firstName' onChange={handleChange}  className="border-t-0 outline-none w-full" required />
          </div>
          <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
            <p>Last Name</p>
            <input type="text" value={formData.lastName} name='lastName'  onChange={handleChange}  className="border-t-0 outline-none w-full" required/>
          </div>
          <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
            <p>Email</p>
            <input type="email" value={formData.email}  name='email' onChange={handleChange}  placeholder="example@gmail.com" className="border-t-0 outline-none w-full" required/>
          </div>
          <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
            <p>Phone Number</p>
            <input type="text"  value={formData.phoneNumber} name='phoneNumber' onChange={handleChange} placeholder="+44-" className="border-t-0 outline-none w-full" required/>
          </div>
         
          <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
            <p>Employee Role</p>
            <input type="text" value={formData.role} name='role' onChange={handleChange}   className="border-t-0 outline-none w-full" required/>
           
          </div>
          <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
            <p>Level</p>
          
           <select value={formData.level} name='level' onChange={handleChange} className="border-t-0 outline-none w-full py-1"  placeholder='junior'>
           <option>N/A</option>
            <option>Junior</option>
            <option>Mid Senior</option>
            <option>Senior</option>
            
           </select>
          </div>
          <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
            <p>Joinig Date</p>
            <input type="date" value={formData.joiningDate} name='joiningDate' onChange={handleChange} className="border-t-0 outline-none w-full" required/>
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <button type='submit' className="bg-[#5570F1] text-white rounded-lg px-[47px] py-[14px]">{loading?  <ClipLoader size={25} color={"#ffff"} loading={loading} /> : <p>Add</p>}  </button>
        </div>

        </form>

        
      </div>
    </div>
  </div>
  )
}

export default AddNewMemberForm;
