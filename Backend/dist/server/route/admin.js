"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../controller/adminController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.post('/login', adminController_1.default.login);
router.get('/users', authMiddleware_1.default, adminController_1.default.users);
router.get('/edit/:id', authMiddleware_1.default, adminController_1.default.editGet);
router.post('/edit/:id', authMiddleware_1.default, adminController_1.default.editPost);
router.post('/create', authMiddleware_1.default, adminController_1.default.createUser);
router.delete('/delete/:id', authMiddleware_1.default, adminController_1.default.deleteUser);
router.post('/logout', authMiddleware_1.default, adminController_1.default.logout);
exports.default = router;
