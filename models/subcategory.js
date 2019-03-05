'use strict';
module.exports = (sequelize, DataTypes) => {
    var subCategory = sequelize.define('subCategory', {
        // photoID: DataTypes.INTEGER,
        name: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                models.subCategory.belongsTo(models.Category)
                models.subCategory.hasMany(models.Photo, {
                    as: 'photos'
                })
            }
        }
    });

    subCategory.hook('beforeDestroy', function (subCategory, options, fn) {
        console.log( 'subCategory beforeDestroy' )
        console.log( subCategory.dataValues )
        fn( null, deleted )
    })
    return subCategory;
};