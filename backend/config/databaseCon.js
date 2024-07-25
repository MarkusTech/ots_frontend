const config = {
  db1: {
    user: "sa",
    password: "p@ssw0rd",
    server: "172.16.10.217",
    database: "OTS_DB",
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
  },
  db2: {
    user: "sa",
    password: "Bu1ldm0r3.SBO",
    server: "172.16.50.5",
    database: "BCD_TEST_DB",
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
  },
};

export default config;
