import React from 'react'
import Login from './components/Login.jsx'
import {BrowserRouter as Router , Routes, Route} from 'react-router-dom'
import MainPage from './components/MainPage.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import AddNewMemberPage from './components/AddNewMemberPage.jsx'
import StatusManagment from './components/StatusManagment.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import ManageEmployee from './components/ManageEmployee.jsx'
import ChangeCredentials from './components/ChangeCredentials.jsx'
import AdminProfile from './components/AdminProfile.jsx'
import AdminLogin from './components/AdminLogin.jsx'
import AttendanceRecords from './components/AttendanceRecords.jsx'
import Attendance from './components/Attendance.jsx'
import CheckRecords from './components/CheckRecords.jsx'
import AttendanceReport from './components/AttendanceReport.jsx'
import AddNewSubAdmin from './components/AddNewSubAdmin.jsx'
import DisplaySubAdmin from './components/DisplaySubAdmin.jsx'
import SubadminNavbar from './components/SubadminNavbar.jsx'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/EmployeeList' element={<MainPage/>}/>
        <Route path='/mangeEmployee' element={<StatusManagment/>}/>
        <Route path='/editprofile/:email' element={<ProfilePage/>}/>
        <Route path='/newMember' element={<AddNewMemberPage/>}/>
        <Route path='/adminpanel' element={<AdminPanel/>}/>
        <Route path='/manageEmployeeboard' element={<ManageEmployee/>}/>
        <Route path='/manageAdminProfile' element={<AdminProfile/>}/>
        <Route path='/adminlogin' element={<AdminLogin/>}/>
        <Route path='/managecredentials' element={<ChangeCredentials/>}/>
        <Route path='/attendance' element={<Attendance/>}/>
        <Route path="/attendance/records/:memberId" element={<AttendanceRecords/>} />
        <Route path="/checkrecord" element={<CheckRecords/>} />
        <Route path="/attendancereport/:memberId" element={<AttendanceReport/>} />
        <Route path="/addsubadmin" element={<AddNewSubAdmin/>} />
        <Route path="/displaysubadmin" element={<DisplaySubAdmin/>} />
        <Route path="/subadminpanel" element={<SubadminNavbar/>} />
      </Routes>
    </Router>
  )
}

export default App;
