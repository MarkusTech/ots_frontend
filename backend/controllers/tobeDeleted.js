// Import necessary modules
import sql from "mssql";
import express from "express";

// Create an Express app
const app = express();
app.use(express.json());

// Import MSSQL connection configuration
import sqlConn from "../config/db.js";

// Route to handle the API request
app.post("/saveCommitHeader", async (req, res) => {
  const {
    EntryNum,
    // other fields
    SalesCrew,
    ForeignName,
  } = req.body;

  try {
    // Connect to MSSQL database
    await sql.connect(sqlConn);

    // Define your query to save the commit header
    const query = `
            -- Write your SQL query here to save the commit header
        `;

    // Execute the query
    const result = await sql.query(query);

    // Fetch the DocNum from the result (assuming it's returned)
    const docNum = result.recordset[0].DocNum;

    // Return the DocNum in the response
    res.json({ docNum });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Close the MSSQL connection
    await sql.close();
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
