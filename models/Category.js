'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    label: DataTypes.STRING(50)
  }, {timestamps: false});
  Category.associate = function(models) {

    //Association 0,n and other 1,1 or 0,1
    models.Category.hasMany(models.Product)

  };
  return Category;
};