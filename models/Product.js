'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    label: DataTypes.STRING(50),
    description: DataTypes.TEXT,
    picture: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    delevery_date: DataTypes.DATE,
    nb_sales: DataTypes.INTEGER,
    id_Center: DataTypes.INTEGER,
    id_Category: DataTypes.INTEGER
  }, {timestamps: false});
  Product.associate = function(models) {

    //Association 1,1 or 1,0 and other 1,n or 0,n
    models.Product.belongsTo(models.Center, {foreignKey: 'id_Center', allowNull: false}),
    models.Product.belongsTo(models.Category, {foreignKey: 'id_Category', allowNull: false}),

    //Association 1,n or 0,n with other table   
    models.Product.belongsToMany(models.Cart, { through: models.Contains, foreignKey: 'id_Product'})
  };
  return Product;
};