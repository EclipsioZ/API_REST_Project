'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rank = sequelize.define('Rank', {
    label: DataTypes.STRING(50)
  }, {timestamps: false});
  Rank.associate = function(models) {

    //Association 1,n or 0,n with other table
    models.Rank.belongsToMany(models.Activities, { through: models.CanView, foreignKey: 'id_Rank'}),
    models.Rank.belongsToMany(models.Notification, { through: models.CanNotify, foreignKey: 'id_Rank'}),

    //Association 0,n and other 1,1 or 0,1
    models.Activities.hasMany(models.User)

  };
  return Rank;
};