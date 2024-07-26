import sql from "mssql";
import dotenv from "dotenv";
import colors from "colors";
dotenv.config();

const config = {
  database: process.env.MSSQL_DATABASE_MAIN,
  server: process.env.MSSQL_SERVER_MAIN,
  user: process.env.MSSQL_USERNAME_MAIN,
  password: process.env.MSSQL_PASSWORD_MAIN,
  options: {
    encrypt: false, // Set to false to match the default behavior in VB.NET
    trustServerCertificate: true, // Ensure this is true if self-signed certificates are used
  },
};

const sqlConn2 = sql
  .connect(config)
  .then((pool) => {
    if (pool.connected) {
      console.log("Main Server Database Connected".bgGreen);
    }
    return pool;
  })
  .catch((err) => {
    console.error("Database Connection Failed! Error: ", err);
  });

export default sqlConn2;
