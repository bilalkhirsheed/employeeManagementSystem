import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

const AddNewSubAdmin = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setLoading(false);
      setMessage('Passwords do not match');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    try {
      const response = await fetch('https://userinterfaceproject.vercel.app/api/addsubadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();
      setLoading(false);

      setMessage(result.message);
      if (response.status === 201) {
        setTimeout(() => {
          setMessage('');
          navigate('/adminpanel'); // Redirect to admin panel after successful submission
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      setMessage('Error adding subadmin');
      setTimeout(() => setMessage(''), 2000);
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-[#F2F4F7] min-h-screen p-4">
      {message && (
        <p className="fixed left-[40%] top-10 text-center w-[300px] text-white rounded-sm p-1 bg-yellow-300">
          {message}
        </p>
      )}
      <div className="flex items-center justify-center flex-col gap-8">
        <div className="bg-white rounded-lg w-full md:w-1/2 p-10 mt-4">
          <h1 className="text-[30px] text-[#0E2040] font-semibold">
            Add New SubAdmin
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 pt-8">
              <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
                <p>Username</p>
                <input
                  type="text"
                  value={formData.username}
                  name="username"
                  onChange={handleChange}
                  className="border-t-0 outline-none w-full"
                  required
                />
              </div>
              <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
                <p>Email</p>
                <input
                  type="email"
                  value={formData.email}
                  name="email"
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="border-t-0 outline-none w-full"
                  required
                />
              </div>
              <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
                <p>Password</p>
                <input
                  type="password"
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  className="border-t-0 outline-none w-full"
                  required
                />
              </div>
              <div className="border-2 border-[#CFD3D4] rounded-md px-2 py-1 w-full">
                <p>Confirm Password</p>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  name="confirmPassword"
                  onChange={handleChange}
                  className="border-t-0 outline-none w-full"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between mt-12">
              <button
                type="submit"
                className="bg-[#5570F1] text-white rounded-lg px-[47px] py-[14px]"
              >
                {loading ? (
                  <ClipLoader size={25} color={'#fff'} loading={loading} />
                ) : (
                  <p>Add</p>
                )}
              </button>
              <button
                type="button"
                className="bg-black text-white rounded-lg px-[47px] py-[14px]"
                onClick={() => navigate('/adminpanel')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewSubAdmin;
