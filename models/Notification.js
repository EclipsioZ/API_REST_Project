'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    title: DataTypes.STRING(50),
    content: DataTypes.TEXT,
    date: DataTypes.DATE,
    id_Center: DataTypes.INTEGER
  }, {timestamps: false});
  Notification.associate = function(models) {

    //Association 1,1 or 1,0 and other 1,n or 0,n
    models.Notification.belongsTo(models.Center, {foreignKey: 'id_Center', allowNull: false}),

    //Association 1,n or 0,n with other table
    models.Notification.belongsToMany(models.Rank, { through: models.CanNotify, foreignKey: 'id_Notification'})
  };
  return Notification;
};