// import mongoose from "mongoose";
// import colors from "colors";

// const connectDB = async () => {
//   try {
//     const connect = await mongoose.connect(process.env.MONGODB);
//     console.log(
//       `Database connected on ${connect.connection.host} ${connect.connection.name}`
//         .bgGreen
//     );
//   } catch (err) {
//     console.log(err);
//     process.exit(1);
//   }
// };

// export default connectDB;
// const sql = require('mssql');

import sql from "mssql";

const config = {
  database: MSSQL_DATABASE,
  server: MSSQL_SERVER,
  user: MSSQL_USERNAME,
  password: MSSQL_PASSWORD,
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
