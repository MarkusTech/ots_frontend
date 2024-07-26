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
console.log("MSSQL Database Connected".bgGreen);
});

export default sqlConn;

---

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
console.log("MSSQL2 Database Connected".bgGreen);
});

export default sqlConn2;

---

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

sql
.connect(config)
.then((pool) => {
if (pool.connected) {
console.log("MSSQL2 Database Connected".bgGreen);
}
return pool;
})
.catch((err) => {
console.error("Database Connection Failed! Error: ", err);
});

export default sql;
