'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      label: {
        type: Sequelize.STRING(50)
      },
      description: {
        type: Sequelize.TEXT
      },
      picture: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.FLOAT
      },
      delevery_date: {
        type: Sequelize.DATE
      },
      nb_sales: {
        type: Sequelize.INTEGER
      },
      id_Center: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Centers',
          key: 'id'       
        }
      },
      id_Category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categorys',
          key: 'id'       
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Products');
  }
};
