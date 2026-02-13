const bcrypt = require("bcryptjs");
const { PatrolActivity, Location, User, Schedule, Shift } = require("../models");
const jwtUtils = require("../utils/jwt");
const { json, Op, fn, col, literal } = require("sequelize");
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
    const rowCount = parseInt(req.query.rowCount) || 10;
    const offset = (page - 1) * rowCount;

    const { date_from, date_to } = req.query;

    const where = {};
    if (date_from && date_to) {
      const fromDate = date_from;
      const toDate = date_to;

      where.schedule_date = {
        [Op.between]: [fromDate, toDate],
      };
    } 
    else if (date_from) {
      const fromDate = new Date(date_from);
      where.schedule_date = { [Op.gte]: fromDate };
    } else if (date_to) {
      const toDate = new Date(date_to);
      where.schedule_date = { [Op.lte]: toDate };
    }

    const { count, rows } = await PatrolActivity.findAndCountAll({
      limit: rowCount,
      offset,
      include: [
        { model: User, attributes: ["id", "username"] },
        { model: Location, attributes: ["id", "name"] },
        { 
          model: Schedule,
          where:where,
          required:true,
          include:[{model: Shift}]
         },
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

exports.dashboardData = async (req, res) => {
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
    const { date_from, date_to } = req.query;

    const where = {};
    if (date_from && date_to) {
      const fromDate = date_from;
      const toDate = date_to;

      where.schedule_date = {
        [Op.between]: [fromDate, toDate],
      };
    } else if (date_from) {
      const fromDate = new Date(date_from);
      where.schedule_date = { [Op.gte]: fromDate };
    } else if (date_to) {
      const toDate = new Date(date_to);
      where.schedule_date = { [Op.lte]: toDate };
    }

    const rows = await PatrolActivity.findAll({
      include: [
        { 
          model: Schedule,
          where:where,
          required:true,
          attributes: []
         },
      ],
      attributes: [
            [fn('DATE', col('schedule.schedule_date')), 'date'],
            [fn('COUNT', col('patrol_activity.id')), 'total']
          ],
      group: [fn('DATE', col('schedule.schedule_date'))],
      order: [[fn('DATE', col('schedule.schedule_date')), 'ASC']]
    });

    res.json({
      statusCode: 200,
      status: "Success",
      message: "Data Berhasil Ditemukan!",
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

