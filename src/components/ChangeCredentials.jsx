import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const ChangeCredentials = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message,setMessage]=useState('');
    const navigate =useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('https://userinterfaceproject.vercel.app/api/change-credentials', { // Update with the correct API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldPassword, newEmail, newPassword }),
            });
    
            const data = await response.json();
            if (response.ok) {
                setMessage('Your credentials has been changed')
                setTimeout(() => {
               setMessage('');
               navigate('/')
            }, 2000);
             
            } else {
                setMessage(data.message)
                setTimeout(() => {
               setMessage('');
               
            }, 2000);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to change credentials')
             setTimeout(() => {
             setMessage('');
           
        }, 2000);
         
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {message && <p className='fixed left-[38%] top-10 text-center w-[300px] text-white rounded-sm p-1 bg-yellow-300'>{message}</p>}
            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-8 rounded shadow-md w-96"
            >
                <h2 className="text-xl font-bold mb-6 text-center">Change Credentials</h2>

              

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                        type="email" 
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)} 
                        required 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Change Password</label>
                    <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                <div className="flex justify-between">
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                  <Link to='/adminpanel'> <button 
                        type="button" 
                        className="bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-800"
                        onClick={() => { /* Logic for the black button (e.g., cancel action) */ }}
                    >
                        Back
                    </button></Link> 
                </div>
            </form>
        </div>
    );
};

export default ChangeCredentials;
