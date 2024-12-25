"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const connectDb_1 = __importDefault(require("./server/database/connectDb"));
const admin_1 = __importDefault(require("./server/route/admin"));
const user_1 = __importDefault(require("./server/route/user"));
const app = (0, express_1.default)();
(0, connectDb_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: 'http://localhost:5713',
    credentials: true, // Allow credentials (cookies, authorization headers)
}));
// app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use('/', user_1.default);
app.use('/admin', admin_1.default);
app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});
