const bcrypt = require("bcryptjs");
const { PatrolActivity, Location, User } = require("../models");
const jwtUtils = require("../utils/jwt");
const { json, Op } = require("sequelize");
const checkPermission = require("../utils/checkPermission");

exports.patrolActivity = async (req, res) => {
  try {
    const menuId = 4; // /admin/location
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
    const rowCount = parseInt(req.query.rowCount) || 100;
    const offset = (page - 1) * rowCount;

    const { date_from, date_to } = req.query;

    const where = {};
    if (date_from && date_to) {
      // ubah ke format YYYY-MM-DDT00:00:00 lokal
      const fromDate = new Date(`${date_from}T00:00:00`);
      const toDate = new Date(`${date_to}T23:59:59`);

      where.check_date = {
        [Op.between]: [fromDate, toDate],
      };
    } else if (date_from) {
      const fromDate = new Date(`${date_from}T00:00:00`);
      where.check_date = { [Op.gte]: fromDate };
    } else if (date_to) {
      const toDate = new Date(`${date_to}T23:59:59`);
      where.check_date = { [Op.lte]: toDate };
    }

    const { count, rows } = await PatrolActivity.findAndCountAll({
      where,
      limit: rowCount,
      offset,
      include: [
        { model: User, attributes: ["id", "username"] },
        { model: Location, attributes: ["id", "name"] },
      ],
    });

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
      message: "Terjadi Kesalahan Saat Menampilkan Data Patrol Activity!",
      data: err.message,
    });
  }
};
