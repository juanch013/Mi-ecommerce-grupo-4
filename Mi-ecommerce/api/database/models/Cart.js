const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    
    const alias = "cart";
    const cols ={
        cart_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNule: false
        },
        user_id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNule: false,
            unique: true,
            foreignKey: true
        }
    };
    const config = {
        timestamps: true,
        createdAt: true,
        updatedAt: true
    }

    const Cart = sequelize.define(alias,cols,config);
    Cart.associate = (models) => {
        Cart.belongsTo(models.User, {
            as: 'usercart',
            foreignKey: 'user_id'
        })
        Cart.belongsToMany(models.Product, {
            as: "cartproduct",
            through: 'cart_product',
            foreignKey: 'cart_id',
            otherKey: 'product_id'

        })

    }




}