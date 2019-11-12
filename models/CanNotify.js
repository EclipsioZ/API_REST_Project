'use strict';
module.exports = (sequelize, DataTypes) => {
  const CanNotify = sequelize.define('CanNotify', {
    id_Rank: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Rank',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    id_Notification: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Notification',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }
  }, {timestamps: false});
  CanNotify.associate = function(models) {
  };
  return CanNotify;
};