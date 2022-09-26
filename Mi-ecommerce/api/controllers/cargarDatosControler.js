const db = require('../database/models');
// Carga de jsons
const users = require('../../api/data.json/user.json');
const cargarDatosController = {
    carga: async function(req,res){
        for await (let u of users) {
            await db.User.create({
                first_name: u.first_name,
                last_name: u.last_name,
                username: u.username,
                email: u.email,
                password: u.password,
                role: u.role,
                profilpic: u.profilepic,
            });
        }
        res.status(200).json({
            error:false,
            msg: "Se cargaron los datos exitosamente",
            data:newcategory
        });
    }
}
module.exports = cargarDatosController;