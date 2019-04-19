'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
// var config    = require(__dirname + '/../config/config.json')[env];
var config = require("../config/config.js")
var db        = {};



if (process.env.NODE_ENV === 'production' ) {
  console.log("production set")
  var sequelize = new Sequelize(config.production.database, config.production.username, config.production.password, config.production);
} else {
  var sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, config.development);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  
  if (db[modelName].associate) {
    // console.log( db[modelName])
    db[modelName].associate(db);
  }
});

// sequelize.sync( { force: true } )
sequelize.query('SET FOREIGN_KEY_CHECKS = 0', {}, {raw: true})
.success(function(results) {
    db.sequelize.sync({force: true});
});

db.sequelize = sequelize
db.Sequelize = Sequelize;

module.exports = db;
