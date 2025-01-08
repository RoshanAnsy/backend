"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const router = express_1.default.Router();
// signup and login routes
router.post('/signup', auth_controller_1.signUp);
router.post('/login', auth_controller_1.login);
router.get('/logout', auth_controller_1.logout);
exports.default = router;
