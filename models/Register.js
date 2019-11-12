'use strict';
module.exports = (sequelize, DataTypes) => {
  const Register = sequelize.define('Register', {
    id_User: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    id_Activities: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Activities',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }
  }, {timestamps: false});
  Register.associate = function(models) {
  };
  return Register;
};