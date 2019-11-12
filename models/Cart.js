'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    id_User: DataTypes.INTEGER
  }, {timestamps: false});
  Cart.associate = function(models) {

    //Association 1,1 or 1,0 and other 1,n or 0,n
    models.Cart.belongsTo(models.User, {foreignKey: 'id_User', allowNull: false}),

    //Association 1,n or 0,n with other table
    models.Cart.belongsToMany(models.Product, { through: models.Contains, foreignKey: 'id_Cart'})

  };
  return Cart;
};