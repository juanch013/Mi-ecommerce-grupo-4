const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    
    const alias = "Cart";
    const coils ={
        id_cart: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
    }


}