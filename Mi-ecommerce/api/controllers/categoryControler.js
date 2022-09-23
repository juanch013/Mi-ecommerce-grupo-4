const db = require('../database/models');
const categoryControler = {
    listCategory: async function(req,res){
        const allcategorys= await db.Category.findAll();
        res.send(allcategorys);       
    },
    createCategory:async function(req,res){ 
        const a =await db.Category.create({
            category_name:req.body.name
        });
        res.send(a);
    },
    deleteCategory:async function(req,res){
        await db.Category.destroy({
            where:{
                category_id:req.params.id
            }
        });
        res.send("se destruyo " + req.params.id);
    }
}

module.exports = categoryControler;