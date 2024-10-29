import sql from "mssql";
import dotenv from "dotenv";
import colors from "colors";
dotenv.config();

const config = {
  database: process.env.MSSQL_DATABASE,
  server: process.env.MSSQL_SERVER, // Use the hostname or domain name here
  user: process.env.MSSQL_USERNAME,
  password: process.env.MSSQL_PASSWORD,
  options: {
    encrypt: false, // Set to false to match the default behavior in VB.NET
    trustServerCertificate: true, // Ensure this is true if self-signed certificates are used
  },
};

const sqlConn = sql.connect(config, (err) => {
  if (err) console.log(err);
  console.log("MSSQL Database Connected".bgGreen);
});

export default sqlConn;
