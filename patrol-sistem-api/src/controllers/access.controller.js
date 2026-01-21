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
          if(element.id == permission.role_id && menus.id == permission.menu_id && permission.status == 1){
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

    const data = await RoleMenuPermission.findAll({
      where: {
        role_id: req.params.role_id,
        menu_id: req.params.menu_id
      },
      include:[
        {model:Role},
        {model:Menu},
        {model:Permission}
      ],
    });
    if (data.length < 1){
        return res.status(200).json({ message: "Data Tidak Ditemukan!" });
    }else{
        res.json(data);
    }
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

    const { role_id, menu_id, permission_id, status } = req.body

    const exists = await RoleMenuPermission.findOne({
      where: { 
        role_id,
        menu_id,
        permission_id
      }
    });

    if (!exists) {
      const data = await RoleMenuPermission.create(
        { role_id, menu_id, permission_id, status }
      );
      res.json({
        status: "Success",
        message: "RoleMenuPermission berhasil ditambahkan!",
        data,
      });
    } else {
      const data = await RoleMenuPermission.update({ status }, {
        where: {
          role_id,
          menu_id,
          permission_id
        },
      });

      res.json({
        status: "Success",
        message: "RoleMenuPermission berhasil diperbaharui!",
        data,
      });
    }
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

    const { role_id, menu_id } = req.params;
    const { permission_id, status } = req.body;

    const exists = await RoleMenuPermission.findOne({
      where: { 
        role_id,
        menu_id,
        permission_id
      }
    });

    if (!exists) {
      const data = await RoleMenuPermission.create(
        { role_id, menu_id, permission_id, status }
      );
      res.json({
        status: "Success",
        message: "RoleMenuPermission berhasil ditambahkan!",
        data,
      });
    } else {
      const data = await RoleMenuPermission.update({ status }, {
        where: {
          role_id,
          menu_id,
          permission_id
        },
      });

      res.json({
        status: "Success",
        message: "RoleMenuPermission berhasil diperbaharui!",
        data,
      });
    }

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
