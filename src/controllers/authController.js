const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await registerUser(email, password);
        res.status(201).json({ message: "User registered successfully", user: { email: user.email } });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await loginUser(email, password, process.env.JWT_SECRET, process.env.JWT_EXPIRE);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    register,
    login
};
