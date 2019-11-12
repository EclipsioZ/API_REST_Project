'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CanNotifys', {
      id_Rank: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: false,
        references: {
          model: 'Ranks',
          key: 'id'       
        }
      },
      id_Notification: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: false,
        references: {
          model: 'Notifications',
          key: 'id'       
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CanNotifys');
  }
};
