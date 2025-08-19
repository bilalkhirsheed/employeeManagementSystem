import React, { useState, useEffect } from 'react';
import 'remixicon/fonts/remixicon.css';
import avatar from '../assets/Avatarimg.png';
import { UsepublicContext } from './Context';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const Navbar = () => {
    const { sidebarState, setSidebarState } = UsepublicContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [adminProfile, setAdminProfile] = useState({ name: '', profilePicture: null });
    const [newName, setNewName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [popupVisible, setPopupVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const response = await fetch('https://userinterfaceproject.vercel.app/api/getadminprofile');
                if (!response.ok) {
                    throw new Error('Could not fetch admin profile');
                }
                const data = await response.json();
                setAdminProfile({
                    name: data.name,
                    profilePicture: data.profilePicture 
                        ? `data:image/jpeg;base64,${data.profilePicture}` 
                        : null,
                });
                setNewName(data.name);
            } catch (err) {
                setErrorMessage(err.message);
            }
        };

        fetchAdminProfile();
    }, []);

    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            setLoading(true);
            try {
                const response = await fetch(`https://userinterfaceproject.vercel.app/api/searchEmployee?searchTerm=${encodeURIComponent(searchTerm)}`);
                const data = await response.json();

                if (response.ok) {
                    setSearchResults(data);
                    setErrorMessage('');
                } else {
                    setErrorMessage(data.message);
                    setSearchResults([]);
                }

                setPopupVisible(true);
            } catch (error) {
                console.error('Error searching for employees:', error);
                setErrorMessage('Error searching for employees.');
                setSearchResults([]);
                setPopupVisible(true);
            } finally {
                setLoading(false);
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const formatPhoneNumber = (phone) => {
        return phone.length > 10 ? `${phone.slice(0, 10)}...` : phone;
    };

    const closePopup = () => {
        setPopupVisible(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <div className='bg-gray-200 py-5 px-4 w-full h-[90px]'>
            <div className='flex justify-between items-center'>
               <div></div>

                <div className='flex gap-8 items-center group'>
                    <div className='relative flex cursor-pointer gap-2 py-3 items-center'>
                        <img src={avatar} alt='' className="w-10 h-10 rounded-full" />
                        <p className='text-[18px]'>{newName}</p>

                        <div className="absolute top-full left-0 hidden group-hover:flex flex-col items-start bg-white shadow-lg rounded-lg p-2">
                            <Link to='/manageAdminProfile'>
                                <button className="text-left py-2 px-4 hover:bg-blue-500 hover:text-white transition-colors duration-200">
                                    Admin Profile
                                </button>
                            </Link>
                            <Link to='/'>
                                <button className="text-left py-2 px-4 hover:bg-red-500 hover:text-white transition-colors duration-200">
                                    Logout
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='flex lg:hidden cursor-pointer'>
                    {!sidebarState ? (
                        <i
                            className="ri-menu-line text-[30px]"
                            onClick={() => setSidebarState(!sidebarState)}
                        ></i>
                    ) : (
                        <i
                            className="ri-close-line text-[30px]"
                            onClick={() => setSidebarState(!sidebarState)}
                        ></i>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-center mt-10 w-full h-full">
                <ClipLoader color="#007bff" loading={loading} size={100} />
            </div>

            {/* Popup for search results */}
            {popupVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg relative w-[90%] max-w-3xl">
                        {loading ? (
                            <div className="flex items-center justify-center w-full h-full">
                                <ClipLoader color="#007bff" loading={loading} size={50} />
                            </div>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold mb-2">Search Results</h2>
                                {errorMessage ? (
                                    <p>{errorMessage}</p>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border">Name</th>
                                                <th className="py-2 px-4 border">Employee Role</th>
                                                <th className="py-2 px-4 border">Phone</th>
                                                <th className="py-2 px-4 border">Level</th>
                                                <th className="py-2 px-4 border">Joined</th>
                                                <th className="py-2 px-4 border">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {searchResults.map((employee) => (
                                                <tr key={employee.id} className="hover:bg-gray-100">
                                                    <td className="py-2 px-4 border">{employee.firstName} {employee.lastName}</td>
                                                    <td className="py-2 px-4 border">{employee.role}</td>
                                                    <td className="py-2 px-4 border">{formatPhoneNumber(employee.phoneNumber)}</td>
                                                    <td className="py-2 px-4 border">{employee.level}</td>
                                                    <td className="py-2 px-4 border">{formatDate(employee.joiningDate)}</td>
                                                    <td className="py-2 px-4 border">{employee.status}</td>
                                                </tr>
                                            ))}
                                            {searchResults.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4">No records found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                                <button onClick={closePopup} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
                                    Close
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
