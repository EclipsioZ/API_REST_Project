'use strict';
module.exports = (sequelize, DataTypes) => {
  const Preferences = sequelize.define('Preferences', {
    theme: DataTypes.INTEGER(50),
    notification: DataTypes.BOOLEAN
  }, {timestamps: false});
  Preferences.associate = function(models) {

    //Association 0,n and other 1,1 or 0,1  
    models.Preferences.hasMany(models.User)
  };
  return Preferences;
};