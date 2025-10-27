const bcrypt = require('bcryptjs');
const { User, RoleMenuPermission, Permission} = require('../models');
const jwtUtils = require('../utils/jwt');
const { json } = require('sequelize');

exports.generateQr = async (req, res) => {
    // Generate QR
    const { location_id } = req.body;
    const QrLocation = jwtUtils.generateToken({
          location_id: location_id
    });
    res.json({token_location: QrLocation});
}
exports.readQr = async (req, res) => {
    const { token_location } = req.body;
    const payload = jwtUtils.verifyToken(token_location);
    res.json({data: payload});
}
exports.checking = async (req, res) => {
    const menuId = 3;                       // /patrol/check
    const permissionId = [2];               // 2 create, 3 edit
    const { token_location, notes, file_images } = req.body;

    // validasi akses
    const menupPermission = await RoleMenuPermission.findAll({
      where: {role_id: req.user.role_id, menu_id:menuId},
      include : [{
        model:Permission
      }]
    });
    if(menupPermission.length > 0){
        const havingPermission = menupPermission.map(p => p.permission.id);
        const hasAllPermissions = permissionId.every(id => havingPermission.includes(id));
        if(hasAllPermissions){
            res.json({message:"Permision Access Granted"});
        }else{
            res.json({message:"Permision Access minimum Create"});
        }
        console.log(menupPermission);
        console.log(req.user);
        res.json({message:"halo"});
    }else{
        res.json({message:"Access not Allowed, Contact Sys Admin for Access"});
    }
    
};