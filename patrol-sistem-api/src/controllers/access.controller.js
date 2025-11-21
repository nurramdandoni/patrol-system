const { RoleMenuPermission, Role, Menu, Permission } = require("../models");
const { Op } = require("sequelize");
const checkPermission = require("../utils/checkPermission");

// 🔹 Get all with pagination
exports.getAll = async (req, res) => {
  try {
    const menuId = 10; // /admin/menu
    const permissionId = [1]; // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: "Access",
        message: "Access Not Allowed",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const rowCount = parseInt(req.query.rowCount) || 10;
    const offset = (page - 1) * rowCount;

    const { count, rows } = await RoleMenuPermission.findAndCountAll({
      include:[
        {model:Role},
        {model:Menu},
        {model:Permission}
      ],
      // limit: rowCount,
      // offset,
    });

    const { count:countRole, rows:rowsRole } = await Role.findAndCountAll();
    const { count:countMenu, rows:rowsMenu } = await Menu.findAndCountAll();
    
    let listAccess = [];
    
    rowsRole.forEach(element => {
      rowsMenu.forEach(menus => {
        let listPermission = [];

        rows.forEach(permission => {
          if(element.id == permission.role_id && menus.id == permission.menu_id){
              listPermission.push(permission.permission.action);
          }
        });
        const roleData = {
          role_id:element.id,
          role:element.name,
          menu_id:menus.id,
          menu:menus.name,
          action:listPermission
        };
        listAccess.push(roleData);
      });
    });

    res.json({
      statusCode: 200,
      status: "Success",
      message: "Data Berhasil Ditemukan!",
      totalData: countRole,
      data: listAccess,
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Terjadi Kesalahan Saat Menampilkan Data RoleMenuPermission!",
      data: err.message,
    });
  }
};

// 🔹 Get by ID
exports.getById = async (req, res) => {
  try {
    const menuId = 10; // /admin/menu
    const permissionId = [1]; // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: "Access",
        message: "Access Not Allowed",
      });
    }

    const data = await RoleMenuPermission.findByPk(req.params.id);
    if (!data)
      return res.status(404).json({ message: "Data Tidak Ditemukan!" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Create
exports.create = async (req, res) => {
  try {
    const menuId = 10; // /admin/menu
    const permissionId = [2]; // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: "Access",
        message: "Access Not Allowed",
      });
    }

    const data = await RoleMenuPermission.create(req.body);
    res.status(201).json({
      status: "Success",
      message: "RoleMenuPermission berhasil ditambahkan!",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Gagal menambahkan RoleMenuPermission.",
      data: err.message,
    });
  }
};

// 🔹 Update
exports.update = async (req, res) => {
  try {
    const menuId = 10; // /admin/menu
    const permissionId = [3]; // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: "Access",
        message: "Access Not Allowed",
      });
    }

    const data = await RoleMenuPermission.findByPk(req.params.id);
    if (!data)
      return res.status(404).json({ message: "Data Tidak Ditemukan!" });

    await data.update(req.body);
    res.json({
      status: "Success",
      message: "RoleMenuPermission berhasil diperbaharui!",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Gagal memperbaharui RoleMenuPermission.",
      data: err.message,
    });
  }
};

// 🔹 Delete
exports.delete = async (req, res) => {
  try {
    const data = await RoleMenuPermission.findByPk(req.params.id);
    if (!data)
      return res.status(404).json({ message: "Data Tidak Ditemukan!" });

    await data.destroy();
    res.json({
      status: "Success",
      message: "RoleMenuPermission berhasil dihapus!",
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Data masih digunakan di tabel lain!",
      data: err.message,
    });
  }
};
