import React, { useState, useEffect } from 'react';
import { AiFillDelete } from 'react-icons/ai'; // Importing delete icon from react-icons
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, email }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete this subadmin?</p>
                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                        onClick={() => onConfirm(email)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const DisplaySubAdmin = () => {
    const [subadmins, setSubadmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState('');
    const navigate = useNavigate();

    // Fetch all subadmins from the backend
    const fetchSubadmins = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://userinterfaceproject.vercel.app/api/subadminslist');
            const result = await response.json();
            setSubadmins(result);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            
            setMessage('Error fetching subadmins');
            setTimeout(()=>{
                setMessage('')
            },2000)
        }
    };

    useEffect(() => {
        fetchSubadmins();
    }, []);

    // Delete a subadmin by email
    const handleDelete = async (email) => {
        setDeleteLoading(true);
        try {
            const response = await fetch(`https://userinterfaceproject.vercel.app/api/deletesubadmin/${email}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (response.ok) {
                setMessage(result.message);
                setTimeout(()=>{
                    setMessage('')
                },2000)
                setSubadmins(subadmins.filter((subadmin) => subadmin.Email !== email));
            } else {
                setMessage(result.message || 'Error deleting subadmin');
                setTimeout(()=>{
                    setMessage('')
                },2000)
            }
            setDeleteLoading(false);
            setIsModalOpen(false); // Close the modal after deletion
        } catch (error) {
            setDeleteLoading(false);
            setMessage('Error deleting subadmin');
            setTimeout(()=>{
                setMessage('')
            },2000)
            setIsModalOpen(false);
        }
    };

    // Open modal and set selected subadmin email for deletion
    const openDeleteModal = (email) => {
        setSelectedEmail(email);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            {message && <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-300 p-2 rounded">{message}</div>}
            <div className="container mx-auto">
                <h1 className="text-3xl font-semibold mb-6">Subadmin List</h1>

                {loading ? (
                    <ClipLoader size={50} color="#5570F1" loading={loading} />
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="text-left py-2 px-4">Username</th>
                                <th className="text-left py-2 px-4">Email</th>
                                <th className="text-left py-2 px-4">Password</th>
                                <th className="text-left py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subadmins.map((subadmin) => (
                                <tr key={subadmin.Email} className="border-t">
                                    <td className="py-2 px-4">{subadmin.Username}</td>
                                    <td className="py-2 px-4">{subadmin.Email}</td>
                                    <td className="py-2 px-4">{subadmin.Password}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => openDeleteModal(subadmin.Email)}
                                            disabled={deleteLoading}
                                        >
                                            <AiFillDelete size={24} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
             <Link to='/addsubadmin'>  <div className='mt-10'>
                <button className='p-2 rounded-md bg-blue-400 text-[18px] text-white '>Add New Subadmin</button>
            </div></Link> 
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                email={selectedEmail}
            />
            
        </div>
    );
};

export default DisplaySubAdmin;
