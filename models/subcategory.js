'use strict';
module.exports = (sequelize, DataTypes) => {
  var subCategory = sequelize.define('subCategory', {
    photoID: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.subCategory.belongsTo( models.Category )
        models.subCategory.hasMany( models.Photo, { as: 'photos'} )
      }
    }
  });
  return subCategory;
};