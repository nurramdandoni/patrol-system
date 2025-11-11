const bcrypt = require('bcryptjs');
const { Location, PatrolActivity, User} = require('../models');
const jwtUtils = require('../utils/jwt');
const { json, Op } = require('sequelize');
const checkPermission = require('../utils/checkPermission');
const { now } = require('sequelize/lib/utils');

exports.readQr = async (req, res) => {
    const { token_location } = req.body;
    const payload = jwtUtils.verifyToken(token_location);
    res.json({data: payload});
}
exports.list = async (req, res) => {
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

    const { count, rows } = await Location.findAndCountAll({
      limit: rowCount,
      offset,
    });
    const where = {};
    const today = new Date();
    const dateOnly = new Date(today.toISOString().split('T')[0]); 
    where.createdAt = { [Op.gte]: dateOnly }
    console.log(where);
    const { count: countActivity, rows: rowsActivity } = await PatrolActivity.findAndCountAll({
      where,
      limit: rowCount,
      offset,
      include: [
        {model:User, attributes:['id','username']},
        {model:Location, attributes:['id','name']}
      ]
    });

    let data = [];
    rows.forEach((item) => {
        data.push({
            id: item.id,
            name: item.name,
            token_location: jwtUtils.generateToken({location_id: item.id}),
            patrol_activity: rowsActivity.filter(pa => pa.location_id === item.id)
        });
    });



    res.json({
      statusCode: 200,
      status: 'Success',
      message: 'Data Berhasil Ditemukan!',
      totalData: count,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      status: 'Error',
      message: 'Terjadi Kesalahan Saat Menampilkan Data Lokasi!',
      data: err.message,
    });
  }
};
exports.checking = async (req, res) => {
    const menuId = 5;                       // /admin/location
    const permissionId = [2];               // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: 'Access',
        message: 'Access Not Allowed',
      });
    }

    const { token_location, notes, file_images } = req.body;
    const payload = jwtUtils.verifyToken(token_location);

    console.log(payload);
    // simpan data ke tabel patrol actvity
    const newPatrol = await PatrolActivity.create({
        check_date: new Date(),
        check_by: req.user.user_id,
        location_id: payload.location_id,
        check_notes: notes,
        check_image: file_images,
        check_status:1, // 1 check in, 0 check not
    });

    res.json({
        statusCode: 200,
        status: 'Success',
        message: 'Check Patrol Berhasil Disimpan!',
        data: newPatrol,
    });

    
};