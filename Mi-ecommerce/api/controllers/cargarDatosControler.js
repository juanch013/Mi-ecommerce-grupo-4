const db = require('../database/models');
// Carga de jsons
const users = require('../../api/data.json/user.json');
const products = require('../../api/data.json/products.json');
const categories = require('../../api/data.json/categories.json');
const cargarDatosController = {
    carga: async function(req,res){
        //cargar usuarios
        for await (let u of users) {
            await db.User.upsert({
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
        });
    }
}
module.exports = cargarDatosController;