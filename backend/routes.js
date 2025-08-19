const express = require('express');
const { addNewMember,getAllMembers,deleteSubadmin,getAllSubadmins,addSubadmin,getIndiviualAttendanceData,addAttendance,getAttendanceData,checkoutAttendance,checkIn,checkOut,getAttendanceRecords, adminLogin,adminProfile,updateAdminProfile,getAdminProfile,changeCredentials,searchEmployee,checkMemberExists,updateStatus,displayAdminCredentials,deleteMemberByEmail,login, getMemberByEmail,updateMember } = require('./controllers');

const router = express.Router();

router.post('/new-member', addNewMember);
router.post('/loginAdmin', login);
router.get('/getMembers', getAllMembers);
router.get('/check-member/:email', checkMemberExists);
router.delete('/deleteMemberfromTable/:email', deleteMemberByEmail);
router.get('/getMemberByEmail/:email', getMemberByEmail); 
router.put('/updateMember/:email', updateMember);
router.put('/updateStatus/:email', updateStatus);
router.post('/change-credentials', changeCredentials);
router.get('/searchEmployee', searchEmployee);
 router.post('/adminprofile', adminProfile);
router.get('/getadminprofile', getAdminProfile);
router.post('/updateadminprofile',updateAdminProfile);
router.post('/adminlogin',adminLogin);
router.post('/attendance/checkin', checkIn);
router.post('/attendance/checkout', checkoutAttendance);
router.get('/attendance/records/:memberId', getAttendanceRecords);
router.post('/attendance/add', addAttendance);
router.get('/attendance/:month/:year', getAttendanceData);
router.get('/attendance/:month/:year/:memberId', getIndiviualAttendanceData);
router.post('/addsubadmin', addSubadmin);
router.get('/subadminslist', getAllSubadmins);
router.delete('/deletesubadmin/:email',deleteSubadmin);
module.exports = router;
