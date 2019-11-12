'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Registers', {
      id_User: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'       
        }
      },
      id_Activities: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: false,
        references: {
          model: 'Activities',
          key: 'id'       
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Registers');
  }
};