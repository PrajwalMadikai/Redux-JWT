"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModal_1 = __importDefault(require("../modal/userModal"));
dotenv_1.default.config();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log('inside of admin login');
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const admin = yield userModal_1.default.findOne({ email, isAdmin: true });
        if (!admin) {
            res.status(404).json({ message: 'Admin user not found' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, admin.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const jwtSecret = process.env.jwt_token;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const token = jsonwebtoken_1.default.sign({ userId: admin._id, email: admin.email, isAdmin: true }, jwtSecret, { expiresIn: '1h', });
        res.status(200).json({
            message: 'Admin login successful',
            token,
        });
    }
    catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
const users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let fetchUsers = yield userModal_1.default.find({ isAdmin: false });
        if (!fetchUsers) {
            res.status(401).json({ message: 'Failed Fetching users' });
            return;
        }
        res.status(200).json({ message: 'users fetched', users: fetchUsers });
    }
    catch (error) {
        console.log(error);
    }
});
const editGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = req.params.id;
    try {
        let user = yield userModal_1.default.findOne({ _id: userId });
        if (!user) {
            res.status(404).json({ message: 'no user is found' });
            return;
        }
        res.status(200).json({ message: 'selected user edit', email: user.email });
        return;
    }
    catch (error) {
    }
});
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = req.params.id;
    const email = req.body.newEmail;
    console.log('edited:', email);
    try {
        let user = yield userModal_1.default.findByIdAndUpdate({ _id: userId }, { email: email });
        if (!user) {
            res.status(404).json({ message: 'no user is found' });
            return;
        }
        res.status(200).json({ message: 'selected user edit', user });
        return;
    }
    catch (error) {
        console.log(error);
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield userModal_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        yield userModal_1.default.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully', userId });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: 'Admin logout successfully' });
    }
    catch (error) {
        console.log(error);
    }
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, isAdmin } = req.body;
    try {
        let user = yield userModal_1.default.findOne({ email });
        if (user) {
            res.status(404).json({ message: 'user already existis' });
            return;
        }
        let hash = yield bcrypt_1.default.hash(password, 10);
        let newUser = new userModal_1.default({
            email,
            password: hash,
            isAdmin,
            isBlock: false
        });
        yield newUser.save();
        res.status(200).json({ message: 'user created successfully', user: newUser });
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = { login, users, editPost, editGet, deleteUser, logout, createUser };
