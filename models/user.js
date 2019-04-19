'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.TEXT,
    admin: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // models.User.hasMany( models.Photo, { as: 'photos'})
      }
    }
  });
  return User;
};