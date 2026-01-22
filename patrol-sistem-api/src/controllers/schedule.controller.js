const { Schedule, Shift, LocationType, User, Employee } = require("../models");
const { Op, where } = require("sequelize");
const checkPermission = require("../utils/checkPermission");

// 🔹 Get all with pagination
exports.getAll = async (req, res) => {
  try {
    const menuId = 13; // /admin/schedule
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

    const { count, rows } = await Schedule.findAndCountAll({
      limit: rowCount,
      offset,
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
      message: "Terjadi Kesalahan Saat Menampilkan Data Schedule!",
      data: err.message,
    });
  }
};
// 🔹 Get where without pagination
exports.getAllWhere = async (req, res) => {
  try {
    const menuId = 13; // /admin/schedule
    const permissionId = [1]; // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: "Access",
        message: "Access Not Allowed",
      });
    }

    const now = new Date(); // UTC by default

    const currentYear  = now.getUTCFullYear();
    const currentMonth = String(now.getUTCMonth() + 1).padStart(2, '0'); // 01–12

    const monthParam = req.query.month || `${currentYear}-${currentMonth}`;

    if (!monthParam) {
        return res.status(400).json({ message: "Month is required" });
    }

    const [year, month] = monthParam.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const { count, rows } = await Schedule.findAndCountAll({
        include:[
          {model:Shift},
          {model:LocationType},
          {model:User,
            include:[
              {model:Employee}
            ]

          }
        ],
        where: {
            schedule_date: {
                [Op.between]: [startDate, endDate]
            }
        }
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
      message: "Terjadi Kesalahan Saat Menampilkan Data Schedule!",
      data: err.message,
    });
  }
};

// 🔹 Get by ID
exports.getById = async (req, res) => {
  try {
    const menuId = 13; // /admin/schedule
    const permissionId = [1]; // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: "Access",
        message: "Access Not Allowed",
      });
    }

    const data = await Schedule.findByPk(req.params.id);
    if (!data)
      return res.status(404).json({ message: "Data Tidak Ditemukan!" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 🔹 Get by multiple query param
exports.getByQueryParam = async (req, res) => {
  try {
    const menuId = 13; // /admin/schedule
    const permissionId = [1]; // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: "Access",
        message: "Access Not Allowed",
      });
    }

    const { scheduleDate, shiftId, locationTypeId, checkerId } = req.params;
    const { count, rows } = await Schedule.findAndCountAll({
        include:[
          {model:User,
            include:[
              {model:Employee}
            ]
          }
        ],
        where: {
            schedule_date: scheduleDate,
            shift_id: shiftId,
            location_type_id: locationTypeId,
            checker_id: checkerId
        }
    });

    res.json({
      statusCode: 200,
      status: "Success",
      message: "Data Berhasil Ditemukan!",
      totalData: count,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Create
exports.create = async (req, res) => {
  try {
    const menuId = 13;
    const permissionId = [2];
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: "Access",
        message: "Access Not Allowed",
      });
    }

    const {
      schedule_date,
      shift_id,
      location_type_id,
      checker_id,
      status
    } = req.body;

    // 🔎 cek existing schedule (composite key)
    const existing = await Schedule.findOne({
      where: {
        schedule_date,
        shift_id,
        location_type_id,
        checker_id
      }
    });

    let data;
    let message;

    if (existing) {
      // 🔁 UPDATE
      await existing.update({ status });
      data = existing;
      message = "Jadwal berhasil diperbarui";
    } else {
      // ➕ INSERT
      data = await Schedule.create({
        schedule_date,
        shift_id,
        location_type_id,
        checker_id,
        status
      });
      message = "Jadwal berhasil ditambahkan";
    }

    res.json({
      status: "Success",
      message,
      data
    });

  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Gagal menyimpan Schedule.",
      data: err.message,
    });
  }
};


// 🔹 Update
exports.update = async (req, res) => {
  try {
    const menuId = 13; // /admin/schedule
    const permissionId = [3]; // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: "Access",
        message: "Access Not Allowed",
      });
    }

    const { scheduleDate, shiftId, locationTypeId, checkerId } = req.params;
    const { schedule_date, shift_id, location_type_id, checker_id, status } = req.body;

    const oldKey = {
      schedule_date: scheduleDate,
      shift_id: shiftId,
      location_type_id: locationTypeId,
      checker_id: checkerId
    };

    const newData = {
      schedule_date: schedule_date, // dari body
      shift_id,
      location_type_id,
      checker_id,
      status
    };

    // cek apakah data lama ada
    const existing = await Schedule.findOne({ where: oldKey });

    // 🔴 cek konflik data baru
    const conflict = await Schedule.findOne({
      where: {
        ...newData,
        schedule_date: schedule_date
      }
    });

    if (conflict && (!existing || conflict.id !== existing.id)) {
      return res.status(409).json({
        message: "Jadwal dengan kombinasi ini sudah ada"
      });
    }

    let data;

    if (existing) {
      await existing.update(newData);
      data = existing;
    } else {
      data = await Schedule.create(newData);
    }

    res.json({
      status: "Success",
      message: existing
        ? "Jadwal berhasil dipindahkan / diperbarui"
        : "Jadwal berhasil ditambahkan",
      data
    });

  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Gagal memperbaharui Jadwal.",
      data: err.message,
    });
  }
};

// 🔹 Delete
exports.delete = async (req, res) => {
  try {
    const data = await Schedule.findByPk(req.params.id);
    if (!data)
      return res.status(404).json({ message: "Data Tidak Ditemukan!" });

    await data.destroy();
    res.json({
      status: "Success",
      message: "Schedule berhasil dihapus!",
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Data masih digunakan di tabel lain!",
      data: err.message,
    });
  }
};
