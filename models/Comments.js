'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define('Comments', {
    content: DataTypes.TEXT,
    id_Comments: DataTypes.INTEGER,
    id_User: DataTypes.INTEGER,
    id_Picture: DataTypes.INTEGER
  }, {timestamps: false});
  Comments.associate = function(models) {
    
    //Association 1,1 or 1,0 and other 1,n or 0,n
    models.Comments.belongsTo(models.User, {foreignKey: 'id_User', allowNull: false}),
    models.Comments.belongsTo(models.Comments, {foreignKey: 'id_Comments', allowNull: false}),

    //Association 0,n and other 1,1 or 0,1
    models.Comments.hasMany(models.Comments),

    //Association 1,n or 0,n with other table
    models.Comments.belongsToMany(models.User, { through: models.Like, foreignKey: 'id_Comments'})

  };
  return Comments;
};