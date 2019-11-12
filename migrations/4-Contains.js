'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Contains', {
      id_Cart: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Carts',
          key: 'id'       
        }
      },
      id_Product: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Products',
          key: 'id'       
        }
      },
      quantity: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Contains');
  }
};
