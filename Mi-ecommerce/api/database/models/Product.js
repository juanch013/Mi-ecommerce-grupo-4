const Product = (sequelize, DataType)=>{

    let alias = 'Product'
    
    let cols={

        product_id:{
            type:DataType.INTEGER,
            autoIncrement:true,
            primaryKey: true
        },

        title:{
            type: DataType.STRING,
            allowNull:false
        },

        price:{
            type: DataType.INTEGER,
            allowNull:false
        },

        description:{
            type: DataType.STRING,
            allowNull:true
        },

        category_id:{
            type: DataType.INTEGER,
            foreignKey:true
        },

        mostwanted:{
            type: DataType.TINYINT(1),
            defaultValue: 0
        },

        stock:{
            type: DataType.INTEGER,
            allowNull:false,
            defaultValue:0
        }

    }

    let conf = {
        timestamps:true
    }

    const Product = sequelize.define(alias,cols,conf);
        Product.associate = (models)=>{
            Product.hasMany(models.Picture,{
                as:"productpicture",
                foreignKey:"product_id"
            })

            Product.belongsToMany(models.Cart,{
                as:"productcart",
                through:"cart_product",
                foreignKey:"product_id",
                otherKey:"cart_id"
            })

            Product.belongsTo(models.Category,{
                as:"productcategoria",
                foreignKey:"category_id"
            })
        }
    return Product;
}

module.exports = Product;