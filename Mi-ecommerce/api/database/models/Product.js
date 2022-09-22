const Product = (sequelize, DataType)=>{

    let alias = 'Product'
    
    let cols={

        id:{
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

        categoria_id:{
            type: DataType.INTEGER,
            foreignKey:true
        },

        mostwanted:{
            type: DataType.TINYINT(1),
            default: 0
        },

        stock:{
            type: DataType.INTEGER,
            allowNull:false,
            default:0
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

            Product.hasMany(models.Cart,{
                as:"productcart",
                through:"CartProduct",
                foreignKey:"product_id",
                otherKey:"cart_id"
            })

            Product.belongsTo(models.Categoria,{
                as:"productcategoria",
                foreignKey:"categoria_id"
            })
        }
    return Product;
}

module.exports = Product;