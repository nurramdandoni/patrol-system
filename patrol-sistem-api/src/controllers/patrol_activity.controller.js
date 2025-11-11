const bcrypt = require('bcryptjs');
const { PatrolActivity, Location, User } = require('../models');
const jwtUtils = require('../utils/jwt');
const { json, Op } = require('sequelize');
const checkPermission = require('../utils/checkPermission');

exports.patrolActivity = async (req, res) => {
  try {
    const menuId = 4;                       // /admin/location
    const permissionId = [1];               // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: 'Access',
        message: 'Access Not Allowed',
      });
    }
    
    const page = parseInt(req.query.page) || 1;
    const rowCount = parseInt(req.query.rowCount) || 10;
    const offset = (page - 1) * rowCount;

    const { date_from, date_to } = req.query;

    const where = {};
    if (date_from && date_to) {
      where.createdAt = {
        [Op.between]: [new Date(date_from), new Date(date_to)],
      };
    } else if (date_from) {
      where.createdAt = { [Op.gte]: new Date(date_from) };
    } else if (date_to) {
      where.createdAt = { [Op.lte]: new Date(date_to) };
    }

    const { count, rows } = await PatrolActivity.findAndCountAll({
      where,
      limit: rowCount,
      offset,
      include: [
        {model:User, attributes:['id','username']},
        {model:Location, attributes:['id','name']}
      ]
    });

    

    res.json({
      statusCode: 200,
      status: 'Success',
      message: 'Data Berhasil Ditemukan!',
      totalData: count,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      status: 'Error',
      message: 'Terjadi Kesalahan Saat Menampilkan Data Patrol Activity!',
      data: err.message,
    });
  }
};