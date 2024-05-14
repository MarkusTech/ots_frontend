import sql from "mssql";
import dotenv from "dotenv";
import colors from "colors";
dotenv.config();

const config = {
  database: process.env.MSSQL_DATABASE2,
  server: process.env.MSSQL_SERVER2, // Use the hostname or domain name here
  user: process.env.MSSQL_USERNAME2,
  password: process.env.MSSQL_PASSWORD2,
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
      servername: process.env.MSSQL_SERVER, // Use the hostname or domain name here
    },
  },
};

const sqlConn2 = sql.connect(config, (err) => {
  if (err) console.log(err);
  console.log("MSSQL2 DB Connected".bgGreen);
});

export default sqlConn2;
