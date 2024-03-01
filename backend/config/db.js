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
    trustedConnection: true,
    trustServerCertificate: true,
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
      servername: process.env.MSSQL_SERVER, // Use the hostname or domain name here
    },
  },
};

const sqlConn = sql.connect(config, (err) => {
  if (err) console.log(err);
  console.log("MSSQL DB Connected".bgGreen);
});

export default sqlConn;
