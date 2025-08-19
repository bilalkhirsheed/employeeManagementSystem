const e = require('cors');
const { sql, poolPromise } = require('./db'); // Ensure you reference the correct file

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const pool = await poolPromise;

        // Check if user exists in the Credentials table (Admin)
        const adminQuery = `
            SELECT * FROM Credentials 
            WHERE email = @Email AND password = @Password
        `;
        
        const adminResult = await pool.request()
            .input('Email', sql.NVarChar, email)
            .input('Password', sql.NVarChar, password)
            .query(adminQuery);
        
        if (adminResult.recordset.length > 0) {
            // Admin found
            return res.status(200).json({ success: true, message: 'Admin login successful' });
        }

        // If not found in Credentials table, check in Subadmin table
        const subadminQuery = `
        SELECT * FROM Subadmin 
        WHERE (username = @Email OR email = @Email) AND password = @Password
    `;
        
        const subadminResult = await pool.request()
            .input('Email', sql.NVarChar, email)
            .input('Password', sql.NVarChar, password)
            .query(subadminQuery);

        if (subadminResult.recordset.length > 0) {
            // Subadmin found
            return res.status(200).json({ success: true, message: 'Subadmin login successful' });
        } else {
            // Invalid credentials
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function adminLogin(req, res) {
    const { email, password } = req.body;
  
    // Hardcoded admin credentials
    const adminEmail = 'utd.racingpost@outlook.com';
    const adminPassword = 'admin123';
  
    // Check if the email and password match the hardcoded values
    if (email === adminEmail && password === adminPassword) {
      return res.status(200).json({ message: 'Login successful', success: true });
    } else {
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }
  };
  async function getAdminProfile(req, res) {
    try {
        const pool = await poolPromise;

        // Query to fetch admin profile details
        const selectQuery = `
            SELECT name, profilePicture
            FROM AdminProfile1
            WHERE id = 1
        `;

        const result = await pool.request().query(selectQuery);

        if (result.recordset.length > 0) {
            const adminProfile = result.recordset[0];
            
            // Convert profilePicture to base64 only if it exists
            if (adminProfile.profilePicture) {
                adminProfile.profilePicture = adminProfile.profilePicture.toString('base64');
            }

            res.json(adminProfile);
        } else {
            res.status(404).json({ message: 'Admin profile not found.' });
        }
    } catch (error) {
        console.error('Error retrieving admin profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function updateAdminProfile(req, res) {
    const { name } = req.body;
    const profilePicture = req.body.profilePicture; // base64 string of the image
    
    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    try {
        const pool = await poolPromise;

        // Process the base64 image if provided
        let pictureData = null;
        if (profilePicture) {
            const base64Data = profilePicture.split(',')[1]; // Split to get only the base64 part
            pictureData = Buffer.from(base64Data, 'base64'); // Convert to binary
        }

        // Update query with profile picture if provided
        let updateQuery = `UPDATE AdminProfile1 SET name = @Name`;
        if (pictureData) {
            updateQuery += `, profilePicture = @Picture`;
        }
        updateQuery += ` WHERE id = 1;`; // Assuming there's only one admin profile

        // Build the SQL request with the inputs
        const request = pool.request()
            .input('Name', sql.NVarChar, name);
        
        if (pictureData) {
            request.input('Picture', sql.VarBinary, pictureData);
        }

        await request.query(updateQuery);

        // Fetch the updated profile to return
        const updatedProfileQuery = `
            SELECT name, profilePicture FROM AdminProfile1 WHERE id = 1;
        `;
        const result = await pool.request().query(updatedProfileQuery);
        const updatedProfile = result.recordset[0];

        // Send the updated profile back with the profile picture as base64
        res.json({
            name: updatedProfile.name,
            profilePicture: updatedProfile.profilePicture
                ? updatedProfile.profilePicture.toString('base64') // Convert binary back to base64
                : null,
        });
    } catch (error) {
        console.error('Error updating admin profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Function to create the AdminProfile1 table and insert default values
async function adminProfile(req, res) {
    try {
        const pool = await poolPromise;
        
        // Create the AdminProfile1 table if it doesn't exist
        const createTableQuery = `
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AdminProfile1')
            BEGIN
                CREATE TABLE AdminProfile1 (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    name NVARCHAR(100) NOT NULL DEFAULT 'Bilal',
                    profilePicture VARBINARY(MAX) NULL
                );
            END;
        `;
        await pool.request().query(createTableQuery);

        // Check if default entry exists, if not, insert the default record
        const checkDefaultEntryQuery = `
            IF NOT EXISTS (SELECT * FROM AdminProfile1 WHERE name = 'Bilal')
            BEGIN
                INSERT INTO AdminProfile1 (name, profilePicture)
                VALUES ('Bill Smith', NULL);
            END;
        `;
        await pool.request().query(checkDefaultEntryQuery);

        res.status(200).json({ message: 'AdminProfile1 table created successfully with default entry.' });
    } catch (error) {
        console.error('Error creating AdminProfile1 table:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


// Add this to your existing route handler file
async function changeCredentials(req, res) {
    const {  newEmail, newPassword } = req.body;

    try {
        const pool = await poolPromise;

      
        const checkPasswordQuery = `
            SELECT TOP 1 email
            FROM Credentials
        `;

        const result = await pool.request().query(checkPasswordQuery);
        

        
        if (result.length===0) {
            return res.status(404).json({ message: 'Email  not found' });
        }

      

     
        const deleteQuery = `
            DELETE FROM Credentials
        `;
        await pool.request().query(deleteQuery);

     
        const insertQuery = `
            INSERT INTO Credentials (email, password) 
            VALUES (@NewEmail, @NewPassword)
        `;

        await pool.request()
            .input('NewEmail', sql.NVarChar, newEmail)
            .input('NewPassword', sql.NVarChar, newPassword) 
            .query(insertQuery);

        res.json({ message: 'Credentials updated successfully' });
    } catch (error) {
        console.error('Error changing credentials:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const addSubadmin = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const pool = await poolPromise;
        const checkQuery = `SELECT * FROM Subadmin WHERE Email = @Email`;

        // Check if subadmin already exists
        const result = await pool.request()
            .input('Email', sql.NVarChar(100), email)
            .query(checkQuery);

        if (result.recordset.length > 0) {
            return res.status(400).json({ message: 'Subadmin with this email already exists' });
        }

        // Insert new subadmin
        const insertQuery = `
            INSERT INTO Subadmin (Username, Email, Password)
            VALUES (@Username, @Email, @Password)
        `;
        await pool.request()
            .input('Username', sql.NVarChar(50), username)
            .input('Email', sql.NVarChar(100), email)
            .input('Password', sql.NVarChar(100), password)
            .query(insertQuery);

        res.status(201).json({ message: 'Subadmin added successfully' });
    } catch (error) {
        console.error('Error adding subadmin:', error);
        res.status(500).json({ message: 'Error adding subadmin' });
    }
};
const getAllSubadmins = async (req, res) => {
    try {
        const pool = await poolPromise;
        const query = 'SELECT Username, Email, Password FROM Subadmin';
        
        const result = await pool.request().query(query);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error retrieving subadmins:', error);
        res.status(500).json({ message: 'Error retrieving subadmins' });
    }
};
const deleteSubadmin = async (req, res) => {
    const { email } = req.params; // Get email from the request params

    try {
        const pool = await poolPromise;
        console.log('I am ready to delete subadmin')
        const deleteQuery = 'DELETE FROM Subadmin WHERE Email = @Email';

        const result = await pool.request()
            .input('Email', sql.NVarChar(100), email)
            .query(deleteQuery);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Subadmin not found' });
        }

        res.status(200).json({ message: 'Subadmin deleted successfully' });
    } catch (error) {
        console.error('Error deleting subadmin:', error);
        res.status(500).json({ message: 'Error deleting subadmin' });
    }
};


// async function updateAdminProfile(req, res) {
//     try {
//         const pool = await poolPromise;
//         const { name } = req.body;  // Get name from form data
//         let pictureData = null;

//         // If a picture file is provided, store it as binary data
//         if (req.files && req.files.picture) {
//             pictureData = req.files.picture.data; // Assuming `express-fileupload` is used
//         }

//         // Update query to change admin profile
//         const updateQuery = `
//             UPDATE AdminProfile
//             SET name = @Name, picture = @Picture
//             WHERE id = 1; -- Assuming there's only one admin profile
//         `;

//         await pool.request()
//             .input('Name', sql.NVarChar, name)
//             .input('Picture', sql.VarBinary, pictureData) // This will be NULL if no picture is provided
//             .query(updateQuery);

//         // Fetch updated profile to return
//         const updatedProfileQuery = `
//             SELECT name, picture FROM AdminProfile WHERE id = 1;
//         `;
//         const result = await pool.request().query(updatedProfileQuery);
//         const updatedProfile = result.recordset[0];

//         res.json(updatedProfile);
//     } catch (error) {
//         console.error('Error updating admin profile:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// }


async function searchEmployee(req, res) {
    const { searchTerm } = req.query; // Get the search term from the query parameters

    try {
        const pool = await poolPromise;

        // Split the search term into parts (expecting both first and last names)
        const searchTerms = searchTerm.split(' ').map(term => term.trim()).filter(term => term);

        // Ensure that we have both first and last names for the search
        if (searchTerms.length < 2) {
            return res.status(400).json({ message: 'Please provide both first name and last name.' });
        }

        // Create a dynamic SQL query that checks both firstName and lastName
        const whereClauses = searchTerms.map((term, index) => 
            `(firstName LIKE @SearchTerm${index} OR lastName LIKE @SearchTerm${index})`
        ).join(' AND '); // Join clauses with AND to ensure both names are matched

        const searchQuery = `
            SELECT * 
            FROM Members 
            WHERE ${whereClauses}
        `;

        const request = pool.request();
        
        // Loop through search terms to create input parameters
        searchTerms.forEach((term, index) => {
            request.input(`SearchTerm${index}`, sql.NVarChar, `%${term}%`); // Use wildcards for partial matches
        });

        const result = await request.query(searchQuery);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No members found' });
        }

        res.json(result.recordset);
    } catch (error) {
        console.error('Error searching for employees:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function addNewMember(req, res) {
    const { firstName, lastName, email, phoneNumber,role,level, joiningDate, profilePicture } = req.body;

    try {
        const pool = await poolPromise;
        password='12345'
        const query = `
            INSERT INTO Members (firstName, lastName, email, phoneNumber, password, role,level, joiningDate, profilePicture)
            VALUES (@firstName, @lastName, @email, @phoneNumber, @password, @role, @level, @joiningDate, @profilePicture)
        `;

        await pool.request()
            .input('firstName', sql.NVarChar, firstName)
            .input('lastName', sql.NVarChar, lastName)
            .input('email', sql.NVarChar, email)
            .input('phoneNumber', sql.NVarChar, phoneNumber)
            .input('password', sql.NVarChar, password)
            .input('role', sql.NVarChar, role)
            .input('level', sql.NVarChar, level)
            .input('joiningDate', sql.Date, joiningDate)
            .input('profilePicture', sql.VarBinary, Buffer.from(profilePicture.split(',')[1], 'base64'))
            .query(query);

        res.json({ message: 'New member added successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function getAllMembers(req, res) {
  try {
      const pool = await poolPromise;
      const query = `
          SELECT id, firstName, lastName, email, phoneNumber, role,level, joiningDate, status, profilePicture
          FROM Members
      `;

      const result = await pool.request().query(query);
      const members = result.recordset;

      // Convert profile picture from Buffer to base64 string
      members.forEach(member => {
          if (member.profilePicture) {
           
              member.profilePicture = member.profilePicture.toString('base64');
          }
      });

      res.json(members);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function checkMemberExists(req, res) {
  const { email } = req.params;
  console.log(email);
  try {
      const pool = await poolPromise;
      const query = `
          SELECT COUNT(*) as count 
          FROM Members 
          WHERE email = @Email
      `;

      const result = await pool.request()
          .input('Email', sql.NVarChar, email)
          .query(query);

      const exists = result.recordset[0].count > 0;
      res.json({ exists });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function deleteMemberByEmail(req, res) {
    const { email } = req.params;

    try {
        const pool = await poolPromise;

        // Step 1: Get the member ID using the email
        const memberQuery = `
            SELECT id FROM Members 
            WHERE email = @Email
        `;
        const memberResult = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query(memberQuery);

        // Check if member exists
        if (memberResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Member not found!' });
        }

        const memberId = memberResult.recordset[0].id;

        // Step 2: Delete related attendance records
        const deleteAttendanceQuery = `
            DELETE FROM Attendance 
            WHERE memberId = @MemberId
        `;
        await pool.request()
            .input('MemberId', sql.Int, memberId)
            .query(deleteAttendanceQuery);

        // Step 3: Delete the member
        const deleteMemberQuery = `
            DELETE FROM Members 
            WHERE email = @Email
        `;
        await pool.request()
            .input('Email', sql.NVarChar, email)
            .query(deleteMemberQuery);

        res.json({ message: 'Member deleted successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getMemberByEmail(req, res) {
  const { email } = req.params;

  try {
      const pool = await poolPromise;
      const query = `
          SELECT id, firstName, lastName, email, phoneNumber, role, level, joiningDate, profilePicture
          FROM Members
          WHERE email = @Email
      `;

      const result = await pool.request()
          .input('Email', sql.NVarChar, email)
          .query(query);

      const member = result.recordset[0];

      if (member) {
          // Convert profile picture from Buffer to base64 string
          if (member.profilePicture) {
              member.profilePicture = member.profilePicture.toString('base64');
          }
          res.json(member);
      } else {
          res.status(404).json({ message: 'Member not found' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function updateMember(req, res) {
  const { email } = req.params;
  const { firstName, lastName, phoneNumber, role, level, profilePicture } = req.body;

  try {
      const pool = await poolPromise;
      const query = `
          UPDATE Members
          SET
              firstName = @firstName,
              lastName = @lastName,
              phoneNumber = @phoneNumber,
              role = @role,
              level = @level,
              profilePicture = @profilePicture
          WHERE email = @Email
      `;

      await pool.request()
          .input('firstName', sql.NVarChar, firstName)
          .input('lastName', sql.NVarChar, lastName)
          .input('phoneNumber', sql.NVarChar, phoneNumber)
          .input('role', sql.NVarChar, role)
          .input('level', sql.NVarChar, level)
          .input('profilePicture', sql.VarBinary, profilePicture ? Buffer.from(profilePicture.split(',')[1], 'base64') : null)
          .input('Email', sql.NVarChar, email)
          .query(query);

      res.json({ message: 'Member updated successfully!' });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
}


async function updateStatus(req, res) {
    const { email } = req.params; 
    const { status } = req.body; 
  
    try {
        const pool = await poolPromise;
        const query = `
            UPDATE Members
            SET
                status = @status
            WHERE email = @Email
        `;
  
        await pool.request()
            .input('status', sql.NVarChar, status)
            .input('Email', sql.NVarChar, email)
            .query(query);
  
        res.json({ message: 'Member status updated successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async function initializeAdminCredentials() {
    try {
        const pool = await poolPromise;

        // Create the Credentials table if it doesn't exist
        const createTableQuery = `
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Credentials')
            BEGIN
                CREATE TABLE Credentials (
                    email NVARCHAR(100) UNIQUE,
                    password NVARCHAR(100)
                )
            END
        `;
        await pool.request().query(createTableQuery);

        
        const checkAdminQuery = `
            IF NOT EXISTS (SELECT * FROM Credentials WHERE email = 'admin@gmail.com')
            BEGIN
                INSERT INTO Credentials (email, password)
                VALUES ('admin@gmail.com', 'admin123')
            END
        `;
        await pool.request().query(checkAdminQuery);

        console.log('Admin credentials initialized successfully');
    } catch (err) {
        console.error('Error initializing admin credentials:', err);
    }
}

// Function to retrieve and display the admin credentials
async function displayAdminCredentials(req, res) {
    try {
        const pool = await poolPromise;
        
        // Query to get the admin credentials
        const query = `
            SELECT email, password 
            FROM Credentials 
            WHERE email = 'admin@gmail.com'
        `;
        const result = await pool.request().query(query);
        const adminCredentials = result.recordset[0];

        if (adminCredentials) {
            // Send admin credentials in the response
            res.json({ email: adminCredentials.email, password: adminCredentials.password });
        } else {
            res.status(404).json({ message: 'Admin credentials not found' });
        }
    } catch (err) {
        console.error('Error fetching admin credentials:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}





async function checkIn (req, res) {
    const { memberId } = req.body;

    try {
        const pool = await poolPromise; // Ensure you have your poolPromise properly configured
        const today = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

        // Check if the user already checked in today
        const checkExisting = await pool.request()
            .input('memberId', sql.Int, memberId)
            .input('attendanceDate', sql.Date, today)
            .query('SELECT * FROM AttendanceRecords WHERE memberId = @memberId AND attendanceDate = @attendanceDate');

        if (checkExisting.recordset.length > 0) {
            return res.status(400).json({ success: false, message: 'Already checked in today' });
        }

        // Insert the check-in record
        await pool.request()
            .input('memberId', sql.Int, memberId)
            .input('checkInTime', sql.DateTime, new Date())
            .input('attendanceDate', sql.Date, today)
            .query('INSERT INTO AttendanceRecords (memberId, checkInTime, attendanceDate) VALUES (@memberId, @checkInTime, @attendanceDate)');

        res.status(200).json({ success: true, message: 'Check-in successful' });
    } catch (error) {
        console.error('Error checking in:', error);
        res.status(500).json({ success: false, message: 'Error during check-in' });
    }
};


// Check-out function
// Check-out function
async function checkOut (req, res) {
    const { memberId } = req.body;

    try {
        const pool = await poolPromise;
        const today = new Date().toISOString().split('T')[0];

        // Check if the user checked in today and hasn't checked out yet
        const checkExisting = await pool.request()
            .input('memberId', sql.Int, memberId)
            .input('attendanceDate', sql.Date, today)
            .query('SELECT * FROM AttendanceRecords WHERE memberId = @memberId AND attendanceDate = @attendanceDate AND checkOutTime IS NULL');

        if (checkExisting.recordset.length === 0) {
            return res.status(400).json({ success: false, message: 'Check-in first or already checked out' });
        }

        // Update the check-out time
        await pool.request()
            .input('memberId', sql.Int, memberId)
            .input('checkOutTime', sql.DateTime, new Date())
            .input('attendanceDate', sql.Date, today)
            .query('UPDATE AttendanceRecords SET checkOutTime = @checkOutTime WHERE memberId = @memberId AND attendanceDate = @attendanceDate');

        res.status(200).json({ success: true, message: 'Check-out successful' });
    } catch (error) {
        console.error('Error during check-out:', error);
        res.status(500).json({ success: false, message: 'Error during check-out' });
    }
};





    async function getAttendanceRecords (req, res) {
    const { memberId } = req.params;

    try {
        const pool = await poolPromise;
        const records = await pool.request()
            .input('memberId', sql.Int, memberId)
            .query('SELECT * FROM AttendanceRecords WHERE memberId = @memberId ORDER BY attendanceDate DESC');

        res.status(200).json({ success: true, records: records.recordset });
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ success: false, message: 'Error fetching attendance records' });
    }
};


async function addAttendance(req, res) {
    const { memberId, attendanceDate, status } = req.body;

    // Log incoming request data
    console.log("Incoming attendance data:", req.body);

    // Check for missing fields
    if (!memberId || !attendanceDate || !status) {
        console.error('Missing required fields:', { memberId, attendanceDate, status });
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Check for status length
    if (status.length > 10) {
        console.error('Status too long:', status);
        return res.status(400).json({ message: 'Status must be 10 characters or less.' });
    }

    // Parse attendance date and log it
    const parsedDate = new Date(attendanceDate);
    if (isNaN(parsedDate)) {
        console.error('Invalid date:', attendanceDate);
        return res.status(400).json({ message: 'Invalid date format.' });
    }

    try {
        const pool = await poolPromise;

        const addAttendanceQuery = `
            INSERT INTO Attendance (memberId, attendanceDate, status) 
            VALUES (@MemberId, @AttendanceDate, @Status)
        `;

        await pool.request()
            .input('MemberId', sql.Int, memberId)
            .input('AttendanceDate', sql.Date, parsedDate)
            .input('Status', sql.NVarChar(10), status)
            .query(addAttendanceQuery);

        res.status(201).json({ message: 'Attendance recorded successfully.' });
    } catch (error) {
        console.error('Error recording attendance:', error);
        res.status(500).json({ message: 'Error recording attendance.', error });
    }
}


async function checkoutAttendance(req, res) {
    const { memberId, attendanceDate } = req.body;

    try {
        const pool = await poolPromise;

        const deleteAttendanceQuery = `
            DELETE FROM Attendance 
            WHERE memberId = @MemberId AND attendanceDate = @AttendanceDate
        `;

        const result = await pool.request()
            .input('MemberId', sql.Int, memberId)
            .input('AttendanceDate', sql.Date, new Date(attendanceDate))
            .query(deleteAttendanceQuery);

        // Check if any rows were affected (deleted)
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Attendance record not found.' });
        }

        res.status(200).json({ message: 'Checked out successfully.' });
    } catch (error) {
        console.error('Error checking out:', error);
        res.status(500).json({ message: 'Error checking out.', error });
    }
}


// Get attendance data
async function getAttendanceData(req, res) {
    const { month, year } = req.params;
console.log(month,'and',year)
    try {
        const pool = await poolPromise;

        const attendanceDataQuery = `
            SELECT * FROM Attendance 
            WHERE attendanceDate >= @StartDate AND attendanceDate < @EndDate
        `;

        // Correct start date (first day of the given month)
        const startDate = new Date(year, month - 1, 1); // Start of the given month
        
        // Correct end date (first day of the next month)
        const endDate = new Date(year, month, 1); // Start of the next month
   console.log(startDate,' uassuasduh', endDate)
        const attendanceRecords = await pool.request()
            .input('StartDate', sql.Date, startDate)
            .input('EndDate', sql.Date, endDate)
            .query(attendanceDataQuery);

        // Send the retrieved attendance records
        console.log(attendanceRecords.recordset)
        res.status(200).json(attendanceRecords.recordset);
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ message: 'Error fetching attendance data.', error });
    }
}

async function getIndiviualAttendanceData(req, res) {
    const { memberId, month, year } = req.params; // Extract memberId, month, and year from the params
    console.log(`Fetching attendance for member ${memberId} in ${month}/${year}`);

    try {
        const pool = await poolPromise;

        const attendanceDataQuery = `
            SELECT * FROM Attendance 
            WHERE attendanceDate >= @StartDate AND attendanceDate < @EndDate 
            AND memberId = @MemberId
        `;

        // Calculate the correct start date (first day of the given month) and end date (first day of the next month)
        const startDate = new Date(year, month - 1, 1); // Start of the given month
        const endDate = new Date(year, month, 1); // Start of the next month
        console.log('Start date:', startDate, 'End date:', endDate);

        // Fetch attendance records for the specific memberId and within the specified date range
        const attendanceRecords = await pool.request()
            .input('StartDate', sql.Date, startDate)
            .input('EndDate', sql.Date, endDate)
            .input('MemberId', sql.Int, memberId)
            .query(attendanceDataQuery);

        // Send the retrieved attendance records
        res.status(200).json(attendanceRecords.recordset);
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ message: 'Error fetching attendance data.', error });
    }
}

module.exports = { addNewMember,deleteSubadmin,getAllSubadmins,addSubadmin,addAttendance,getIndiviualAttendanceData,checkoutAttendance,getAttendanceData,checkOut,checkIn,getAttendanceRecords,getAdminProfile, adminLogin,adminProfile,updateAdminProfile, getAllMembers,login,searchEmployee,changeCredentials, checkMemberExists, updateStatus, deleteMemberByEmail, getMemberByEmail, updateMember };




