module.exports = (sequelize, DataTypes) => {
const alias = "Category";

const cols = {
    category_id:{
        type:DataTypes.INTEGER,
        primarykEY:true,
        autoIncrement:true
    },
    category_name:{
        type:DataTypes.STRING,
    }
} 

const config = {
    timeStamps: false
}

const catergory = sequelize.define(alias,cols,config);
catergory.associate = (models) => {
    catergory.hasMany(models.Product,{
        foreignKey: "product_id",
    })
}
return catergory;
}
