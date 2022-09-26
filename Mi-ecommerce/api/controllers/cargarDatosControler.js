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
            //devolver un array de los id de usuarios creados
    const users2 = await db.User.findAll({
        attributes: ['user_id']
      })
      const usersMapped = users2.map(user => user.user_id)
    
      //crear por cada id de usuario un carrito 
      for await (let id of usersMapped) {
        await db.Cart.upsert({
          user_id: id,
          cart_id: id
        })
      }
  
      for await (let category of categories) {
        await db.Category.upsert({
          category_name: category.category_name
        })
      }
  
      for await (let product of products) {
        await db.Product.upsert({
          price: product.price,
          title: product.title,
          stock: product.stock,
          mostwanted: product.mostwanted,
          category: product.category
        })
      }
        res.status(200).json({
            error:false,
            msg: "Se cargaron los datos exitosamente",
        });
    }
}
module.exports = cargarDatosController;