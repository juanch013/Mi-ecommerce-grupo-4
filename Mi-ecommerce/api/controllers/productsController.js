const { Op } = require('sequelize');
const fileHelpers = require('../../helpers/filesHelpers');
const db = require('../database/models');
const Picture = require('../database/models/Picture');


const productsController = {

    listar: async (req, res, next)=>{
        try {
            const {category} = req.query
    
            if(category){
    
                let products = await db.Product.findAll({
                    include:[
                        {
                            association:"productcategoria",
                            attributes:{exclude:['category_id','category_name']},
                            where:{
                                category_name:category
                            },
                        }
                    ]
                })
    
                if(products.length == 0){
                    return res.status(404).json({
                        error:true,
                        msg: "Doesn't exist products with this category"
                    })
                }
                
    
                return res.status(200).json({
                    error: false,
                    msg: "Products by category",
                    data: products
                })
                
            }else{
    
                let products = await db.Product.findAll({
                    include:[
                        {
                            association:"gallery",
                            as:"gallery"
                        }
                    ]
                });
        
                return res.status(200).json({
                            error:false,
                            msg: "All products",
                            productos: products
                        })
    
            }
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                msg:'Internal error'
            })
        }
    },

    detalle: async (req, res, next)=>{
       try {
           const {id} = req.params;
   
   
           let prod = await db.Product.findByPk(id,{
               include:[
                   {
                       association:"gallery",
                       as:"gallery"
                   }
               ]
           });
   
           if(!prod){
               return res.status(404).json({
                   error: true,
                   msg: "Product not found"
               })
           }
   
   
           return res.status(200).json({
                           error: false,
                           msg: "Product detail",
                           data: prod
                       });
        
       } catch (error) {
        console.log(error);
            return res.status(500).json({
                error: true,
                msg:'Internal error'
            })
       }
        
    },
    
    mostwanted: async (req, res, next)=>{
        try {
            let products = await db.Product.findAll({
                where:{
                    mostwanted:true
                },
                include:[
                    {
                        association:"gallery",
                        as:"gallery"
                    }
                ]
            })
        
            return res.status(200).json({
                        error: false,
                        msg: "Most wanted products",
                        data: products
                    })
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                msg:'Internal error'
            })
        }

    },

    crear: async (req, res, next)=>{
        try {
            const{title, price, description, gallery, stock, mostwanted, category} = req.body;
    
            const rol = req.newUsers.role;
            
            if(rol == "guest"){
                return res.status(401).json({
                    error: true,
                    msg:"You don't have permission to create a product"
                })
            }
    
            const newProduct = {
                title: title,
                description: description,
                price: price == undefined? 0 : price,
                stock: stock == undefined? 0 : stock,
                mostwanted:mostwanted == undefined? 0 : mostwanted,
                category_id:category
            }
    
            db.Product.create(newProduct);
    
             return res.status(201).json({
                 error:false,
                 msg:"Product created",
                 data: newProduct
             })
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                msg:'Internal error'
            })
        }

        const newProduct = await db.Product.create({
          title: title,
          description: description,
          price: price == undefined? 0 : price,
          stock: stock == undefined? 0 : stock,
          mostwanted:mostwanted == undefined? 0 : mostwanted,
          category_id:category
        });

        if (!newProduct) {
          return res.status(400).json({
            error: true,
            msg: "Error creating product",
          });
        }

         return res.status(201).json({
             error:false,
             msg:"Product created",
             data: newProduct
         })
    },
    
    eliminar: async (req, res, next)=>{
        try {
            const {id} = req.params;
            const rol = req.newUsers.role;
            
            if(rol == "guest"){
                return res.status(401).json({
                    error: true,
                    msg:"You don't have permission to delete a product"
                })
            }
    
            let n = await db.Product.destroy({
                        where:{
                            product_id:id
                        }
                    });
            
            if(n == 0){
                return res.status(404).json({
                            error: true,
                            msg:"Product not found"
                        })
            }
    
    
            return res.status(200).json({
                        error: false,
                        msg:"Product deleted"
                    })
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                msg:'Internal error'
            })
        }
    },

    busqueda: async (req, res, next)=>{
        try {
            const {q} = req.query; 
    
            let productsFiltrados = await db.Product.findAll({
                where:{
                    [Op.or]:[
                        {title:{
                            [Op.like]:`%${q}%`
                        }},
                        {description:{
                            [Op.like]:`%${q}%`
                        }}
                    ]
                },
    
                include:[
                    {
                        association:"gallery",
                        as:"gallery"
                    }
                ]
            })
    
            return res.status(200).json({
                error: false,
                msg:"Products filtered",
                data: productsFiltrados
            })
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                msg:'Internal error'
            })
        }
    },

    modificar: async (req, res, next)=>{
        try {
            
            const {id} = req.params;
        const rol = req.newUsers.role;
        if(rol == "guest"){
            return res.status(401).json({
                error: true,
                msg:"You don't have permission to modify a product"
            })
        }

        const {title, description, price, gallery, category_id, mostwanted, stock} = req.body;
        let prod = await db.Product.findByPk(id);

        if(category_id != undefined){
            if(!fileHelpers.existeCat(category_id)){
                return res.status(400).jason({
                    error:true,
                    msg:`category with id = ${category_id} does not exist`
                })
            }
        }
        let prodModificado = {
            title: title == undefined? prod.title : title,
            description: description == undefined? prod.description : description,
            price : price == undefined? prod.price : price,
            category_id : category_id == undefined? prod.category_id : category_id,
            mostwanted: mostwanted == undefined? prod.mostwanted : mostwanted,
            stock: stock == undefined? prod.stock : stock
        }
        await db.Product.update(prodModificado,{
            where:{
                product_id : id
            }
        })
        return res.status(200).json({
            error: false,
            msg:"Product modified",
            data:prodModificado
        })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                msg:'Internal error'
            })
        }
        
    },

    pictures: async (req, res, next) => {
        const { id } = req.params;

        try {
    
            const productExists = await db.Product.findByPk(id);
    
            if (!productExists) {
                return res.status(404).json({
                    error: true,
                    msg: 'Product not found',
                });
            }
    
            const picturesProduct = await db.Picture.findAll({
                where: {
                    product_id: id,
                },
            });
    
            if (!picturesProduct.length) {
                return res.status(404).json({
                    error: true,
                    msg: 'The product does not have images',
                });
            }
    
            res.status(200).json({
                error: false,
                msg: 'Product photo list',
                data: picturesProduct,
            });
        } catch (error) {
            next(error);
        }
    },
    categoria: async (req, res, next)=>{

        try {
            const {category} = req.query;
    
           let products = db.Product.findAll({
                where:{
                    category_id:category
                },
                include:[
                    {
                        association:"gallery",
                    }
                ]
           })
    
            if(products.length == 0){
                return res.status(404).json({
                    error:true,
                    msg: "No products found"
                })
            }
    
            return res.status(200).json({
                error:false,
                msg: "Products filtered by category",
                data: products
            })
            
        } catch (error) {
            next(error)
        }


        
    },

}

module.exports = productsController;