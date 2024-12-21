// backend/server.js
const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); 
connectDB(); 
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/users', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/grievances', require('./routes/grievance'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});