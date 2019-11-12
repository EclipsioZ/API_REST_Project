'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id_User: {
        type: DataTypes.INTEGER,
        references: {
          model: 'User',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
    id_Picture: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Picture',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }
  }, {timestamps: false});
  Like.associate = function(models) {
  };
  return Like;
};