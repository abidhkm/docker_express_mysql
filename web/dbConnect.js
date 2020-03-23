var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port:process.env.MySQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // insecureAuth:true
});

module.exports = con;