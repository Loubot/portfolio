'use strict';
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define('Category', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.Category.hasMany( models.Photo, { as: 'photos'})
      }
    }
  });
  return Category;
};