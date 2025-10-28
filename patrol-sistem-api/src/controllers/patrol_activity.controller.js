const bcrypt = require('bcryptjs');
const { PatrolActivity, Location, User } = require('../models');
const jwtUtils = require('../utils/jwt');
const { json } = require('sequelize');
const checkPermission = require('../utils/checkPermission');

exports.patrolActivity = async (req, res) => {
  try {
    const menuId = 5;                       // /admin/location
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

    const { count, rows } = await PatrolActivity.findAndCountAll({
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