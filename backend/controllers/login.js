import sqlConn from "../config/db.js";

const login = async (req, res) => {
  const { userName, Password } = req.body;

  try {
    // Query the database for the user
    const result =
      await sqlConn.query`SELECT * FROM [dbo].[User] WHERE UserName = ${userName}`;
    const user = result.recordset[0];

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    // Compare the provided password with the password in the database
    if (Password !== user.Password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    // If credentials are correct
    res.status(200).json({
      success: true,
      message: "Login successful",
      userId: user.id,
      userName: user.UserName,
      user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { login };
