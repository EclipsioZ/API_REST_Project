'use strict';
module.exports = (sequelize, DataTypes) => {
  const Picture = sequelize.define('Picture', {
    link: DataTypes.TEXT,
    id_User: DataTypes.INTEGER,
    id_Activities: DataTypes.INTEGER
  }, {timestamps: false});
  Picture.associate = function(models) {

    //Association 1,1 or 1,0 and other 1,n or 0,n
    models.Picture.belongsTo(models.User, {foreignKey: 'id_User', allowNull: false}),
    models.Picture.belongsTo(models.Activities, {foreignKey: 'id_Activities', allowNull: false}),

    //Association 0,n and other 1,1 or 0,1
    models.Picture.hasMany(models.Comments),

    //Association 1,n or 0,n with other table
    models.Picture.belongsToMany(models.User, { through: models.Like, foreignKey: 'id_Users'})

  };
  return Picture;
};