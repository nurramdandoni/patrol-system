const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();

// ====== Konfigurasi EJS + Layout ======
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // default layout

// ====== Middleware ======
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // penting buat form POST
app.use(express.static(path.join(__dirname, 'public'))); // folder public untuk CSS/JS/img

// ====== Routing ======
app.get('/', (req, res) => {
  res.render('signin', { title: 'Sign In Page' });
});

app.get('/location', (req, res) => {
  res.render('location', { title: 'Security Kinenta' , titlePage: 'Location' });
});

app.get('/patrol-activity', (req, res) => {
  res.render('patrol-activity', { title: 'Security Kinenta' , titlePage: 'Patrol Activity' });
});

app.get('/patrol-list', (req, res) => {
  res.render('patrol-list', { title: 'Security Kinenta' , titlePage: 'Patrol List' });
});

app.get('/scanner', (req, res) => {
  res.render('scanner', { title: 'Scanner' });
});

// ====== Jalankan Server ======
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Frontend running at http://localhost:${PORT}`);
});
