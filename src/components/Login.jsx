import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../assets/login.jpeg';
import { ClipLoader } from 'react-spinners';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://userinterfaceproject.vercel.app/api/loginAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Set success message from the backend response

        // Check if login is Admin or Subadmin and navigate accordingly
        if (data.message === 'Admin login successful') {
          setTimeout(() => {
            navigate('/adminpanel');
          }, 2000);
        } else if (data.message === 'Subadmin login successful') {
          setTimeout(() => {
            navigate('/subadminpanel');
          }, 2000);
        }

        setLoading(false);
      } else {
        // Handle failed login
        setMessage('Invalid email or password');
        setLoading(false);
        setTimeout(() => {
          setMessage('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('An error occurred while logging in');
      setLoading(false);
      setTimeout(() => {
        setMessage('');
      }, 2000);
    }
  };

  return (
    <div className="flex items-center min-h-screen justify-center">
      <div className="grid sm:grid-cols-1 md:grid-cols-2">
        <img src={loginImage} alt="login" className="sm:w-[200px] sm:h-auto md:w-auto" />
        <div className="p-10">
          <h1 className="sm:text-[18px] md:text-[36px] font-extrabold">Welcome back</h1>
          <p className="sm:text-[10px] md:text-[20px] font-normal">Welcome back! Please enter your details.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col">
              <label>Email/Username</label>
              <input
                type="text"
                name="email"
                className="w-full border-b-2 border-[#A69999] p-1 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="w-full border-b-2 border-[#A69999] p-1 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {message && <p className="text-red-800 text-center">{message}</p>}

            <div className="flex justify-end">
              <span className="border-b-2 text-[15px] font-normal">Forgot Password</span>
            </div>

            <button
              type="submit"
              className={`p-[20px] bg-black text-white text-[16px] font-bold rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
