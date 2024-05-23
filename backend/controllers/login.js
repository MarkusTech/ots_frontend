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

    // Check if the username is "admin" and the password is correct
    if (userName === "admin") {
      // If credentials are correct and the user is an admin
      return res.status(200).json({
        success: true,
        message: "Admin",
        userId: user.id,
        userName: user.UserName,
        user,
      });
    } else {
      // If credentials are correct but the user is not an admin
      return res.status(200).json({
        success: true,
        message: "User",
        userId: user.id,
        userName: user.UserName,
        user,
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { login };
