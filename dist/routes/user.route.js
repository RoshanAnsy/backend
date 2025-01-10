"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/getUserLogs', auth_middleware_1.authorization, user_controller_1.getUserLogs);
router.get('/getAllUsers', auth_middleware_1.authorization, user_controller_1.getAllUsers);
exports.default = router;
