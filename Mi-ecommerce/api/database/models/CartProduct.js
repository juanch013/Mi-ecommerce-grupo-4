const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    
    const alias = "cart_product";
    const cols ={
        cart_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNule: false
        },
        product_id:{
            type: DataTypes.INTEGER,
            allowNule: false,
        },
        quantity:{
            type: DataTypes.INTEGER,
            allowNule: false
        },

    };
    const config = {
        timestamps: true,
        createdAt: true,
        updatedAt: true
    }
    const Cart = sequelize.define(alias,cols,config);




}