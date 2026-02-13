const { Location, LocationType } = require("../models");
const { Op } = require("sequelize");
const checkPermission = require("../utils/checkPermission");
const jwtUtils = require("../utils/jwt");

// 🔹 Get all with pagination
exports.getAll = async (req, res) => {
  try {
    const menuId = 3; // /admin/location
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

    const { count, rows } = await Location.findAndCountAll({
      limit: rowCount,
      offset,
      include: [
        {model: LocationType,
          attributes: ['id','name']
        }
      ],
    });

    for (const item of rows) {
      item.dataValues.token_location = await jwtUtils.generateToken10Years({
        location_id: item.id,
      });
    }

    res.json({
      statusCode: 200,
      status: "Success",
      message: "Data Berhasil Ditemukan!",
      totalData: count,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Terjadi Kesalahan Saat Menampilkan Data Lokasi!",
      data: err.message,
    });
  }
};

// 🔹 Get by ID
exports.getById = async (req, res) => {
  try {
    const menuId = 3; // /admin/location
    const permissionId = [1]; // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: "Access",
        message: "Access Not Allowed",
      });
    }

    const data = await Location.findByPk(req.params.id);
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
    const menuId = 3; // /admin/location
    const permissionId = [2]; // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: "Access",
        message: "Access Not Allowed",
      });
    }

    const data = await Location.create(req.body);
    res.status(201).json({
      status: "Success",
      message: "Lokasi berhasil ditambahkan!",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Gagal menambahkan Lokasi.",
      data: err.message,
    });
  }
};

// 🔹 Update
exports.update = async (req, res) => {
  try {
    const menuId = 3; // /admin/location
    const permissionId = [3]; // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: "Access",
        message: "Access Not Allowed",
      });
    }

    const data = await Location.findByPk(req.params.id);
    if (!data)
      return res.status(404).json({ message: "Data Tidak Ditemukan!" });

    await data.update(req.body);
    res.json({
      status: "Success",
      message: "Lokasi berhasil diperbaharui!",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Gagal memperbaharui Lokasi.",
      data: err.message,
    });
  }
};

// 🔹 Delete
exports.delete = async (req, res) => {
  try {
    const data = await Location.findByPk(req.params.id);
    if (!data)
      return res.status(404).json({ message: "Data Tidak Ditemukan!" });

    await data.destroy();
    res.json({
      status: "Success",
      message: "Lokasi berhasil dihapus!",
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Data masih digunakan di tabel lain!",
      data: err.message,
    });
  }
};

exports.generateQr = async (req, res) => {
  // Generate QR
  const { location_id } = req.body;
  const QrLocation = jwtUtils.generateToken({
    location_id: location_id,
  });
  res.json({ token_location: QrLocation });
};
