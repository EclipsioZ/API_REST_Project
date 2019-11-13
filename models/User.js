'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    lastname: DataTypes.STRING(50),
    firstname: DataTypes.STRING(50),
    mail: DataTypes.STRING(50),
    password: DataTypes.TEXT,
    id_Preferences: DataTypes.INTEGER,
    id_Center: DataTypes.INTEGER,
    id_Rank: DataTypes.INTEGER
  }, {timestamps: false});
  User.associate = function(models) {

    //Association 1,1 or 1,0 and other 1,n or 0,n
    models.User.belongsTo(models.Preferences, {foreignKey: 'id_Preferences', allowNull: false}),
    models.User.belongsTo(models.Rank, {foreignKey: 'id_Rank', allowNull: false}),
    models.User.belongsTo(models.Center, {foreignKey: 'id_Center', allowNull: false}),

    //Association 0,1 and other 1,1 or 0,1
    models.User.hasOne(models.Cart),

    //Association 0,n and other 1,1 or 0,1
    models.User.hasMany(models.Comments),
    models.User.hasMany(models.Activities),
    models.User.hasMany(models.Picture),

    //Association 1,n or 0,n with other table
    models.User.belongsToMany(models.Picture, { through: models.Like, foreignKey: 'id_User'}),
    models.User.belongsToMany(models.Activities, { through: models.Register, foreignKey: 'id_User', otherKey: 'id_Activities'})
  };
  return User;
};