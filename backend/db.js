require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); // Load environment variables from .env file
const sql = require('mssql');


const config = {
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: false,
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to Microsoft Azure');
        return pool; // Successfully return the pool
    })
    .catch(err => {
        console.error('Database Connection Failed! Bad Config: ', err.message);
        throw err; // Rethrow the error to be caught in the calling function
    });

module.exports = {
    sql, poolPromise
};
