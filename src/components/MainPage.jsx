import React from 'react'
import Navbar from './Navbar'
import SideBar from './SideBar'
import EmployeeTable from './EmployeeTable'

const MainPage = () => {
  return (
    <div className='flex w-full'>
    
    <div><SideBar/></div>
    <div className='w-full'>
    <Navbar/>
    <EmployeeTable/>
    </div>
      
    </div>
  )
}

export default MainPage

