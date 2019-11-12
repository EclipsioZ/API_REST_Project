'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contains = sequelize.define('Contains', {
    id_Cart: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cart',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    id_Product: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Product',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    quantity: DataTypes.INTEGER(50)
  }, {timestamps: false});
  Contains.associate = function(models) {
  };
  return Contains;
};