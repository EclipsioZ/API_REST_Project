'use strict';
module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
    label: DataTypes.STRING(50)
  }, {timestamps: false});
  State.associate = function(models) {

    //Association 0,n and other 1,1 or 0,1
    models.State.hasMany(models.Activities)

  };
  return State;
};