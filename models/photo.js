'use strict';
module.exports = (sequelize, DataTypes) => {
  var Photo = sequelize.define('Photo', {
    fullSizeUrl: DataTypes.STRING,
    thumbUrl: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.Photo.belongsTo( models.User, { foreignKey: 'user_id' } )
      }
    }
  });
  return Photo;
};