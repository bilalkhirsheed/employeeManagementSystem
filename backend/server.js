const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import the path module
const memberRoutes = require('./routes'); // Your backend API routes

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

// CORS setup
app.use(cors({
  origin: 'https://userinterfaceproject.vercel.app', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '10mb' }));

// Serve static files (CSS, JS, images)

app.use(express.static(path.join(__dirname, '../src')));
// Backend routes (like /api)
app.use('/api', memberRoutes);



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
