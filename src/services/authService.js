const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwtHelper');
const userDB = require('../models/fakeUserDB');

const registerUser = async (email, password) => {
    const existingUser = userDB.find(u => u.email === email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { email, password: hashedPassword };
    userDB.push(newUser);

    return newUser;
};

const loginUser = async (email, password, secret, expiresIn) => {
    const user = userDB.find(u => u.email === email);

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("---- bcrypt.compare result ----", isMatch);

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = signToken({ email: user.email }, secret, expiresIn);

    return token;
};

module.exports = {
    registerUser,
    loginUser
};
