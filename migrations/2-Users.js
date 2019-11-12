'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lastname: {
        type: Sequelize.STRING(50)
      },
      firstname: {
        type: Sequelize.STRING(50)
      },
      mail: {
        type: Sequelize.STRING(50)
      },
      password: {
        type: Sequelize.TEXT
      },
      id_Preferences: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Preferences',
          key: 'id'       
        }
      },
      id_Center: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Centers',
          key: 'id'       
        }
      },
      id_Rank: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Ranks',
          key: 'id'       
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
