const { sql, poolPromise } = require('./db'); 

async function createTable() {
    try {
        const pool = await poolPromise;

       
        const membersTableQuery = `
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Members')
            BEGIN
                CREATE TABLE Members (
                    id INT PRIMARY KEY IDENTITY,
                    firstName NVARCHAR(50),
                    lastName NVARCHAR(50),
                    email NVARCHAR(100) UNIQUE,
                    phoneNumber NVARCHAR(20),
                    password NVARCHAR(100),
                    role NVARCHAR(20),
                    level NVARCHAR(20),
                    status NVARCHAR(20) DEFAULT 'Not Active',
                    joiningDate DATE,
                    profilePicture VARBINARY(MAX)
                )
            END
        `;

    

        await pool.request().query(membersTableQuery);
       

        console.log('Table check and creation done');
    } catch (err) {
        console.error('Error creating table:', err);
    }
}

createTable();
async function createAttendanceTable() {
    try {
        const pool = await poolPromise;

        // Query to create attendance table
        const attendanceTableQuery = `
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Attendance')
            BEGIN
                CREATE TABLE Attendance (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    memberId INT NOT NULL,
                    attendanceDate DATE NOT NULL,
                    status VARCHAR(10) NOT NULL, -- 'Checked In' or 'Checked Out'
                    createdAt DATETIME DEFAULT GETDATE(),
                    FOREIGN KEY (memberId) REFERENCES Members(id) -- Assuming you have a Members table
                )
            END
        `;

        // Create the attendance table
        await pool.request().query(attendanceTableQuery);
        console.log('Attendance table check and creation done');
    } catch (err) {
        console.error('Error creating attendance table:', err);
    }
}

async function createSubadminTable() {
    try {
        const pool = await poolPromise;

        // Query to create Subadmin table
        const subadminTableQuery = `
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Subadmin')
            BEGIN
                CREATE TABLE Subadmin (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    Username NVARCHAR(50) NOT NULL,
                    Email NVARCHAR(100) UNIQUE NOT NULL,
                    Password NVARCHAR(100) NOT NULL
                )
            END
        `;

        // Create the Subadmin table
        await pool.request().query(subadminTableQuery);
        console.log('Subadmin table check and creation done');
    } catch (err) {
        console.error('Error creating Subadmin table:', err);
    }
}

// Call the function to create the Subadmin table
createSubadminTable();



// Call the function to create the Attendance table
createAttendanceTable();