const login = async (req, res) => {
  res.send("Login");
};

const connection = async (req, res) => {
  res.send("Conneced");
};

export { login, connection };
