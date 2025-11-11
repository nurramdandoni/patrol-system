const bcrypt = require("bcryptjs");
const {
  User,
  Role,
  Menu,
  RoleMenuPermission,
  Permission,
  Employee,
} = require("../models");
const jwtUtils = require("../utils/jwt");
const { json } = require("sequelize");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
      include: [
        { model: Employee }, 
        { model: Role }
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Generate token
    const token = jwtUtils.generateToken({
      user_id: user.id,
      role_id: user.role.id,
      username: user.username,
      role: user.role.name,
    });

    // 🔥 Transformasi data ke bentuk yang lebih rapi
    let menus = [];
    const menu = await Menu.findAll();
    const menupPermission = await RoleMenuPermission.findAll({
      where: { role_id: user.role.id },
      include: [
        {
          model: Permission,
        },
      ],
    });
    for (let i = 0; i < menu.length; i++) {
      let permisionData = [];
      let add = false;
      for (let j = 0; j < menupPermission.length; j++) {
        if (menu[i].id == menupPermission[j].menu_id) {
          permisionData.push(menupPermission[j].permission.action);
          add = true;
        }
      }
      if (add) {
        menus.push({
          menu_id: menu[i].id,
          menu_name: menu[i].name,
          menu_path: menu[i].path,
          menu_permission: permisionData,
        });
      }
    }

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        employee: user.employee,
        role: user.role?.name,
        menus,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.validateToken = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwtUtils.verifyToken(token);
    res.json({ valid: true, decoded });
  } catch (err) {
    res.status(401).json({ valid: false, message: "Token tidak valid" });
  }
};
