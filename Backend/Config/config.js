const mssql = require("mssql");
const dotenv = require("dotenv");
dotenv.config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: "localhost",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
};

mssql.connect(sqlConfig).then(pool => {
  if (pool.connected) {
    console.log("connected to db....");
  }
});

module.exports = {
    sqlConfig
}