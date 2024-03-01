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
