import React from 'react'
import Navbar from './Navbar'
import SideBar from './SideBar';
import AddNewMemberForm from './AddNewMemberForm';
const AddNewMemberPage = () => {
  return (
    <div className='flex w-full'>
    <SideBar/>
    <div className='w-full'>
    <Navbar/>
    <AddNewMemberForm/>
    </div>
  
      
    </div>
  )
}

export default AddNewMemberPage;
