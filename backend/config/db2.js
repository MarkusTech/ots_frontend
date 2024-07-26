import sql from "mssql";
import dotenv from "dotenv";
import colors from "colors";
dotenv.config();

const config = {
  database: process.env.MSSQL_DATABASE_MAIN,
  server: process.env.MSSQL_SERVER_MAIN, // Use the hostname or domain name here
  user: process.env.MSSQL_USERNAME_MAIN,
  password: process.env.MSSQL_PASSWORD_MAIN,
  options: {
    encrypt: false, // Set to false to match the default behavior in VB.NET
    trustServerCertificate: true, // Ensure this is true if self-signed certificates are used
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
      servername: process.env.MSSQL_SERVER_MAIN, // Use the hostname or domain name here
    },
  },
};

const sqlConn2 = sql.connect(config, (err) => {
  if (err) {
    console.error("Database Connection Failed! Error: ", err);
  } else {
    console.log("MSSQL2 Database Connected".bgGreen);
  }
});

export default sqlConn2;
