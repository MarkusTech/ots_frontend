import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const config = {
  database: process.env.MSSQL_DATABASE,
  server: process.env.MSSQL_SERVER,
  user: process.env.MSSQL_USERNAME,
  password: process.env.MSSQL_PASSWORD,
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

const sqlConn = sql.connect(config, (err) => {
  if (err) console.log(err);
  console.log("MSSQL DB Connected");
});

export default sqlConn;
