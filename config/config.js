'use strict'

module.exports = {
  development: {
    username: "loubot",
    password: "pass",
    database: "portfolio",
    host: "localhost",
    dialect: "mysql"
  },
  production: {
    username: process.env.PORT_DB_USERNAME,
    password: process.env.PORT_DB_PASSWORD,
    host: process.env.PORT_DB_HOST,
    database: process.env.PORT_DB_NAME,
    dialect: "mysql"
  }
}


// {
//   "development": {
//     "username": "loubot",
//     "password": "pass",
//     "database": "portfolio",
//     "host": "localhost",
//     "dialect": "mysql"
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//     "username": "",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   }
// }
