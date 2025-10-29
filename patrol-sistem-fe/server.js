const express = require('express');
const path = require('path');
const app = express();

// Middleware bawaan
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve file di folder public

// Endpoint root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/signin', 'signin.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashbord', 'dashboard.html'));
});
app.get('/scanner', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'scanner.html'));
});

// Jalankan server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
