const { Op } = require('sequelize');
const fileHelpers = require('../../helpers/filesHelpers');
const db = require('../database/models');
const Picture = require('../database/models/Picture');


const productsController = {

    listar: async (req, res, next)=>{
        const {category} = req.query
        // let products = fileHelpers.getProducts(next);

        if(category){

            let products = await db.Product.findAll({
                where:{
                    [Op.or]:[
                        {title:{
                            [Op.like]:`%${category}%`
                        }},
                        {description:{
                            [Op.like]:`%${category}%`
                        }}
                    ]
                },

                include:[
                    {
                        association:"productpicture",
                        as:"gallery"
                    }
                ]
            })

            // products = products.filter((prod)=>{return (prod.category).toLowerCase() == (category).toLowerCase()});

            if(products.length == 0){
                return res.status(404).json({
                    error:true,
                    msg: "Doesn't exist products with this category"
                })
            }
            
            // for(prod of products){
            //          prod.gallery = fileHelpers.getPicturesFromProduct(prod.id,next);
            // }

            return res.status(200).json({
                error: false,
                msg: "Products by category",
                data: products
            })
            
        }else{

            let products = await db.Product.findAll({
                include:[
                    {
                        association:"productpicture",
                        as:"gallery"
                    }
                ]
            });
            // for(prod of products){
            //     prod.gallery = fileHelpers.getPicturesFromProduct(prod.id,res,next);
            // }
    
            return res.status(200).json({
                        error:false,
                        msg: "All products",
                        productos: products
                    })

        }
    },

    detalle: async (req, res, next)=>{
        // let products = fileHelpers.getProducts(next);
        const {id} = req.params;


        let prod = await db.Product.findByPk(id,{
            include:[
                {
                    association:"productpicture",
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

        // for(prod of products){
        //     if(prod.id == id){
        //         prod.gallery = fileHelpers.getPicturesFromProduct(prod.id,next);
        //         return res.status(200).json({
        //             error: false,
        //             msg: "Product detail",
        //             data: prod
        //         })
        //     }
        // }

        
    },

    mostwanted: async (req, res, next)=>{
        // let products = fileHelpers.getProducts(next);


        // let filteredProducts = products.filter((prod)=>{
        //     return prod.mostwanted == true;
        // })



        // for(prod of filteredProducts){
        //     prod.gallery = fileHelpers.getPicturesFromProduct(prod.id,next);
        // }

        let products = await db.Product.findAll({
            where:{
                mostwanted:true
            },
            include:[
                {
                    association:"productpicture",
                    as:"gallery"
                }
            ]
        })

        return res.status(200).json({
                    error: false,
                    msg: "Most wanted products",
                    data: products
                })
    },

    crear: async (req, res, next)=>{
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


        // let products = fileHelpers.getProducts(next);
        // products = fileHelpers.ordenarProductos(products);

        // let newId = Number(products[products.length - 1].id) + 1;

        // const newProduct = {
        //     id: newId,
        //     price: price,
        //     title: title,
        //     description : description == undefined? "" : description,
        //     gallery: [],
        //     stock: stock == undefined? 0 : stock,
        //     mostwanted : mostwanted == undefined? false : mostwanted,
        //     category : category
        // }

        // products.push(newProduct);

        // fileHelpers.guardarProducts(products,next);

         return res.status(201).json({
             error:false,
             msg:"Product created",
             data: newProduct
         })

    },
    //------------------- hasta aca actualizado a sequelize
    eliminar: async (req, res, next)=>{
        const {id} = req.params;
        const rol = req.newUsers.role;
        
        if(rol == "guest"){
            return res.status(401).json({
                error: true,
                msg:"You don't have permission to delete a product"
            })
        }

        let n = db.Product.destroy({
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

        // let products = fileHelpers.getProducts(next);

        // if(!products.some((p)=>{ return p.id == id})){
        //     return res.status(404).json({
        //         error: true,
        //         msg:"Product not found"
        //     })
        // }


        
        // //elimina las imagenes del product que se va a eliminar
        // fileHelpers.eliminarPicturesDeProduct(id,next);
        

        // //filtra os productos y guarda el array que no contiene el producto con producto.id == 'id'
        // products = products.filter((prod)=>{return prod.id != id});
        // fileHelpers.guardarProducts(products ,next);
    },

    busqueda: async (req, res, next)=>{
        // let products = fileHelpers.getProducts(next);
        const q = req.query.q;
        return res.send(q);
        let productsFiltrados = [] 
        
        //aca recorro el array de productos y voy pusheando a 'productsFiltrados' los elementos
        //que contengan la keyword del query string

        // products.forEach(element => {
        //     if(element.description.toLowerCase().includes(q.toLowerCase()) || element.title.toLowerCase().includes(q.toLowerCase
        //       ())){
        //         productsFiltrados.push(element);
        //     } 
        // });

        // for(prod of productsFiltrados){
        //     prod.gallery = fileHelpers.getPicturesFromProduct(prod.id,next);
        // }

        // if (productsFiltrados.length == 0){
        //     return res.status(404).json({
        //         error: true,
        //         msg: "No products found"
        //     })
        // }

        // productsFiltrados = await db.Product.findAll({
        //     where:{
        //         [Op.or]:[
        //             {title:{
        //                 [Op.like]:`%${q}%`
        //             }},
        //             {description:{
        //                 [Op.like]:`%${q}%`
        //             }}
        //         ]
        //     },

        //     include:[
        //         {
        //             association:"productpicture",
        //             as:"gallery",
        //             through:[{atributes:[]}]
        //         }
        //     ]
        // })

        // return res.status(200).json({
        //     error: false,
        //     msg:"Products filtered",
        //     data: productsFiltrados
        // })
    },

    modificar: async (req, res, next)=>{
        const {id} = req.params;

        const rol = req.newUsers.role;
        
        if(rol == "guest"){
            return res.status(401).json({
                error: true,
                msg:"You don't have permission to modify a product"
            })
        }

        const {title, description, price, gallery, category, mostwanted, stock} = req.body;

        let products = fileHelpers.getProducts(next);

        if(!products.some((prod)=>{return prod.id == id})){
            return res.status(404).json({
                msg:`Doesn't exist a product with id ${id}`
            })
        }

        let prodModificado = {};

        for(prod of products){
            if(prod.id == id){
                prod.title = title == undefined || title == "" ? prod.title : title;
                prod.description = description == undefined || description == "" ? prod.description : description;
                prod.price = price == undefined? prod.price : price;
                prod.stock = stock == undefined? prod.stock : stock;
                prod.mostwanted = mostwanted == undefined? prod.mostwanted : mostwanted;
                prod.category = category == undefined? prod.undefined : undefined;
                prod.gallery = gallery == undefined? prod.gallery : gallery;
                prodModificado = prod;
                break;
            }
        }
        
        fileHelpers.guardarProducts(products, next);

        return res.status(200).json({
            error: false,
            msg:"Product modified",
            data:prodModificado
        })
    },

    pictures: async (req, res, next) => {
      try {
        const { id } = req.params;

        if (
          req.newUsers.role !== 'admin' &&
          req.newUsers.role !== 'guest' &&
          req.newUsers.role !== 'god'
        ) {
          return res.status(401).json({ 
            error: true,
            msg: 'You are not authorized to access this resource',
          });
        }
    
        const products = fileHelpers.getProducts(res, next);
    
        const productExists = products.find(
          (product) => product.id === parseInt(id)
        );
        if (!productExists) {
          return res.status(404).json({ error: 'Product not found', message: '' });
        }
    
        // Se lee el arhivo de pictures
        const pictures = fileHelpers.getImages(next);
    
        const picturesProduct = pictures?.filter(
          (picture) => picture.productId === parseInt(id)
        );
    
        if (!picturesProduct.length) {
          return res
            .status(404)
            .json({ error: 'The product does not have images', message: '' });
        }
    
        res.status(200).json(picturesProduct);
      } catch (error) {
        next(error);
      }
    },

    categoria: async (req, res, next)=>{

        let products = fileHelpers.getProducts(next);
        const {category} = req.query;
        

        products = products.filter((prod)=>{return prod.category == category});

        if(products.length == 0){
            return res.status(404).json({
                error:true,
                msg: "No products found"
            })
        }

        for(prod of products){
                prod.gallery = fileHelpers.getPicturesFromProduct(prod.id,next);
        }

        return res.status(200).json({
            error:false,
            msg: "Products filtered by category",
            data: products
        })

        
    },

}

module.exports = productsController;