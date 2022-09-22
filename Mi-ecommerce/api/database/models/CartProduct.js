const CartProduct = (sequelize, DataTypes) => {
    
    const alias = "cart_product";
    const cols ={
        cart_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        product_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity:{
            type: DataTypes.INTEGER,
            allowNull: false
        },

    };
    const config = {
        timestamps: true,
        createdAt: true,
        updatedAt: true
    }
    const CartProduct = sequelize.define(alias,cols,config);
    return CartProduct;
}

module.exports = CartProduct