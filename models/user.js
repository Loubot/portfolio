'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: { 
        type: DataTypes.STRING
    },
    password: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        models.User.hasMany( models.Photo, { as: 'photos'})
      }
    }
  });
  return User;
};