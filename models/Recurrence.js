'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recurrence = sequelize.define('Recurrence', {
    label: DataTypes.STRING(50)
  }, {timestamps: false});
  Recurrence.associate = function(models) {

    //Association 0,n and other 1,1 or 0,1
    models.Recurrence.hasMany(models.Activities)

  };
  return Recurrence;
};