import React, { useEffect, useState } from 'react';

const AdminProfile = () => {
    const [adminProfile, setAdminProfile] = useState([]);
    const [newName, setNewName] = useState('');
    const [newPicture, setNewPicture] = useState(null); // Store file directly
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const response = await fetch('https://userinterfaceproject.vercel.app/api/getadminprofile');
                if (!response.ok) {
                    throw new Error('Could not fetch admin profile');
                }
                const data = await response.json();
                console.log('Profile picture from API:', data.profilePicture);

                setAdminProfile({
                    name: data.name,
                    // Check if profilePicture exists and format it as a Base64 image string
                    profilePicture: data.profilePicture
                        ? `data:image/jpeg;base64,${data.profilePicture}`
                        : null,
                });
                setNewName(data.name);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchAdminProfile();
    }, []);

    // Log whenever adminProfile updates
    useEffect(() => {
        if (adminProfile.profilePicture) {
            console.log('Updated admin profile picture:', adminProfile.profilePicture);
        }
    }, [adminProfile]);

    // Convert the image to base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let base64Image = null;
            if (newPicture) {
                base64Image = await convertToBase64(newPicture); // Convert image to base64
            }

            const response = await fetch('https://userinterfaceproject.vercel.app/api/updateadminprofile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newName,
                    profilePicture: base64Image, // Send base64 image string to backend
                }),
            });

            if (!response.ok) {
                throw new Error('Could not update admin profile');
            }

            const updatedProfile = await response.json();
            setAdminProfile({
                name: updatedProfile.name,
                profilePicture: updatedProfile.profilePicture
                    ? `data:image/jpeg;base64,${updatedProfile.profilePicture}`
                    : null,
            });
            setSuccessMessage('Profile updated successfully!');
            setError('');
            setTimeout(()=>{
                setSuccessMessage('')
            },2000)
           
        } catch (err) {
            setError(err.message);
            setTimeout(()=>{
                setError('');
            },2000)
        }
    };

    return (
        <div className="max-w-md mx-auto p-5 border border-gray-300 rounded-lg shadow-lg mt-10">
            <h2 className="text-xl font-semibold mb-4">Admin Profile</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
            <div className="flex flex-col items-center mb-4">
                {adminProfile.profilePicture ? (
                    <img
                        src={adminProfile.profilePicture}
                        alt="Admin Avatar"
                        className="w-32 h-32 rounded-full mb-3"
                    />
                ) : (
                    <p>No profile picture available</p>
                )}
                <h3 className="text-lg font-medium">{adminProfile.name}</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="picture" className="block mb-1 font-medium">Profile Image</label>
                    <input
                        type="file"
                        id="picture"
                        accept="image/*"
                        onChange={(e) => setNewPicture(e.target.files[0])}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default AdminProfile;
