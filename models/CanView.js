'use strict';
module.exports = (sequelize, DataTypes) => {
  const CanView = sequelize.define('CanView', {
    id_Rank: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Rank',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    id_Activities: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Activities',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }
  }, {timestamps: false});
  CanView.associate = function(models) {
  };
  return CanView;
};