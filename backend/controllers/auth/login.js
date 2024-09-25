import sqlConn from "../../config/db.js";

const login = async (req, res) => {
  const { userName, Password } = req.body;

  try {
    const result =
      await sqlConn.query`SELECT * FROM [dbo].[User] WHERE UserName = ${userName}`;
    const user = result.recordset[0];

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    if (Password !== user.Password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    if (userName === "admin") {
      return res.status(200).json({
        success: true,
        message: "Admin",
        userId: user.id,
        userName: user.UserName,
        user,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: user.Position,
        // message: "User",
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
