const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const app = express();

// ====== Konfigurasi EJS + Layout ======
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main2"); // default layout

// ====== Middleware ======
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // penting buat form POST
app.use(express.static(path.join(__dirname, "public"))); // folder public untuk CSS/JS/img

app.use((req, res, next) => {
  res.locals.API_URL = process.env.API_URL; // variabel global EJS
  next();
});

// ====== Routing ======
app.get("/", (req, res) => {
  res.render("signin/index", {
    layout: "layouts/blanks",
    title: "Sign In Page",
  });
});
app.get("/dashboard", (req, res) => {
  res.render("dashboard/index", { title: "Beranda" });
});

app.get("/profile", (req, res) => {
  res.render("profile/index", { title: "Profile" });
});

app.get("/location", (req, res) => {
  res.render("location/index", { title: "Lokasi" });
});

app.get("/patrol-activity", (req, res) => {
  res.render("patrol-activity/index", {
    title: "Aktivitas Patroli",
  });
});

const tanggalSekarang = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
app.get("/patrol-list", (req, res) => {
  res.render("patrol-list/index", {
    title: "Daftar Patroli",
    titlePage: "Patrol List",
    today:tanggalSekarang
  });
});
app.get("/employee", (req, res) => {
  res.render("employee/index", { title: "Pegawai" });
});
app.get("/user", (req, res) => {
  res.render("user/index", { title: "Pengguna" });
});
app.get("/role", (req, res) => {
  res.render("role/index", { title: "Role" });
});
app.get("/menu", (req, res) => {
  res.render("menu/index", { title: "Menu" });
});
app.get("/access", (req, res) => {
  res.render("access/index", { title: "Akses" });
});

app.get("/scanner", (req, res) => {
  res.render("scanner", { layout: "layouts/blanks", title: "Scanner" });
});

// ====== Jalankan Server ======
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Frontend running at http://localhost:${PORT}`);
});
