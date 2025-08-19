import React from 'react'
import SideBar from './SideBar';
import Navbar from './Navbar';
import Profile from './Profile';

const ProfilePage = () => {
  return (
    <div className='flex w-full'>
    
   <div><SideBar/></div>
      <div className='w-full'>
        <Navbar/>
        <Profile/>
      </div>
    </div>
  )
}

export default ProfilePage;
