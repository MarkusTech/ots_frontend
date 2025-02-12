import sql from "mssql";
import dotenv from "dotenv";
import colors from "colors";
dotenv.config();

const config = {
  database: process.env.MSSQL_DATABASE,
  server: process.env.MSSQLL_SERVER,
  user: process.env.MSSQL_USERNAME,
  password: process.env.MSSQL_PASSWORD,
  options: {
    encrypt: false, // Set to false to match the default behavior in VB.NET
    trustServerCertificate: true, // Ensure this is true if self-signed certificates are used
  },
};

sql
  .connect(config)
  .then((pool) => {
    if (pool.connected) {
      console.log(
        `Main Server Database Connected on ${process.env.MSSQL_SERVER}`.bgGreen
      );
    }
    return pool;
  })
  .catch((err) => {
    console.error("Database Connection Failed! Error: ", err);
  });

export default sql;
