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
exports.storage = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const userModal_1 = __importDefault(require("../modal/userModal"));
dotenv_1.default.config();
const uploadDir = process.env.NODE_ENV === 'production'
    ? path_1.default.join(__dirname, '..', 'uploads') // For production: dist/uploads
    : path_1.default.join(__dirname, '..', '..', 'uploads'); // For development: root/uploads
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
exports.storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const oldUser = yield userModal_1.default.findOne({ email });
        if (oldUser) {
            res.status(400).json({ message: 'User already exists', oldUser: true });
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new userModal_1.default({
            email,
            password: hashPassword,
            isAdmin: false,
            isBlock: false,
            image: null
        });
        yield newUser.save();
        res.status(201).json({ message: 'User created successfully', newUser: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            // Ensure execution stops after sending the response
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const userLogin = yield userModal_1.default.findOne({ email });
        if (!userLogin) {
            res.status(404).json({ message: 'User not found', loginSuccess: false });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, userLogin.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials', loginSuccess: false });
            return;
        }
        const jwtSecret = process.env.jwt_token;
        if (!jwtSecret) {
            throw new Error('JWT secret key is not defined in environment variables.');
        }
        const token = jsonwebtoken_1.default.sign({ email: userLogin.email, userId: userLogin._id }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', loginSuccess: true, token });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
        return;
    }
});
const logout = (req, res) => {
    try {
        res.clearCookie('token'); //clearing cookie of JWT
        res.status(200).json({ message: 'Logout successful', logoutSuccess: true });
    }
    catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
};
const upload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = req.params.email;
    const file = req.file;
    console.log('email upload:', email);
    try {
        if (!file) {
            console.log('File not uploaded or missing in /profile');
            res.status(400).send({ message: 'No file uploaded' });
            return;
        }
        const imagePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        ; // Store only the filename, not the full path.
        // Update the user's profile image in the database.
        const updatedUser = yield userModal_1.default.updateOne({ email: email }, { $set: { image: imagePath } });
        if (!updatedUser) {
            res.status(404).send({ message: 'User not found' });
            return;
        }
        res.status(200).send({
            message: 'Profile image updated successfully',
            userData: updatedUser, // Return the image filename.
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error updating profile image' });
    }
});
const user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    try {
        let user = yield userModal_1.default.findOne({ email: email });
        res.status(200).json({ message: 'user data fetched', user });
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = { signup, login, logout, upload, user };
