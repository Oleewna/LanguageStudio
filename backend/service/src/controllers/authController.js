// Controller logic for handling auth POST requests
const authController = (req, res) => {
    const { username, email, password } = req.body;
    const user = username || email;

    if ((user === "admin" || user === "admin@example.com") && password === "1234") {
        res.send("Login successful!");
    } else {
        res.send(`Invalid credentials.<br>Username: ${user || 'none'}<br>Password: ${password}`);
    }
};

exports.authController = authController;
exports.loginController = authController;
