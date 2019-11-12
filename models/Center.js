'use strict';
module.exports = (sequelize, DataTypes) => {
  const Center = sequelize.define('Center', {
    label: DataTypes.STRING(50)
  }, {timestamps: false});
  Center.associate = function(models) {

    //Association 0,n and other 1,1 or 0,1  
    models.Center.hasMany(models.Activities),
    models.Center.hasMany(models.Product),
    models.Center.hasMany(models.User),
    models.Center.hasMany(models.Notification)

  };
  return Center;
};