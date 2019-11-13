'use strict';
module.exports = (sequelize, DataTypes) => {
  const Activities = sequelize.define('Activities', {
    title: DataTypes.STRING(50),
    description: DataTypes.TEXT,
    picture: DataTypes.TEXT,
    begin_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    top_event: DataTypes.BOOLEAN,
    price: DataTypes.FLOAT,
    id_Center: DataTypes.INTEGER,
    id_User: DataTypes.INTEGER,
    id_State: DataTypes.INTEGER,
    id_Recurrence: DataTypes.INTEGER
  }, {
    timestamps: false
  });
  Activities.associate = function(models) {
    //Association 1,1 or 1,0 and other 1,n or 0,n
    models.Activities.belongsTo(models.Center, {foreignKey: 'id_Center', allowNull: false}),
    models.Activities.belongsTo(models.User, {foreignKey: 'id_User', allowNull: false}),
    models.Activities.belongsTo(models.Recurrence, {foreignKey: 'id_Recurrence', allowNull: false}),
    models.Activities.belongsTo(models.State, {foreignKey: 'id_State', allowNull: false}),

    //Association 1,n or 0,n with other table
    models.Activities.belongsToMany(models.Rank, { through: models.CanView, foreignKey: 'id_Activities'}),
    models.Activities.belongsToMany(models.User, { through: models.Register}),

    //Association 0,n and other 1,1 or 0,1
    models.Activities.hasMany(models.Picture)
    
  };
  return Activities;
};