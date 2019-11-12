'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CanViews', {
      id_Activities: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        allowNull: false,
        references: {
          model: 'Activities',
          key: 'id'       
        }
      },
      id_Rank: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: false,
        references: {
          model: 'Ranks',
          key: 'id'       
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CanViews');
  }
};
