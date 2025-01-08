"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.logout = exports.login = exports.signUp = void 0;
const zod_validate_1 = require("../utils/zod.validate");
const __1 = require("..");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jwt = __importStar(require("jsonwebtoken"));
const user_controller_1 = require("./user.controller");
dotenv_1.default.config();
// sign up controller 
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, conformPassword } = req.body;
        // validate the data
        if (!name || !email || !password || !conformPassword) {
            res.status(400).json({
                success: false,
                error: "Please fill all fields"
            });
            return;
        }
        const zodResponse = zod_validate_1.signUpZodSchema.safeParse({ name, email, password, conformPassword });
        if (!zodResponse.success) {
            res.status(400).json({
                success: false,
                error: JSON.parse(zodResponse.error.message)
            });
            return;
        }
        //verify password and confirm password
        if (password !== conformPassword) {
            res.status(400).json({
                success: false,
                error: "Passwords and conformPassword did not matched"
            });
            return;
        }
        // hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, Number(process.env.ROUND));
        if (!hashedPassword) {
            res.status(403).json({
                success: false,
                error: "Error hashing password"
            });
            return;
        }
        const createUser = yield __1.prisma.user.create({
            data: {
                name, email, password: hashedPassword
            }
        });
        if (!createUser) {
            res.status(404).json({
                success: false,
                error: "Error creating user"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "User created successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error
        });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // validate the data
        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: "Please fill all fields"
            });
            return;
        }
        const zodResponse = zod_validate_1.loginZodSchema.safeParse({ email, password });
        if (!zodResponse.success) {
            res.status(400).json({
                success: false,
                error: JSON.parse(zodResponse.error.message)
            });
            return;
        }
        // implement login logic here
        const isUserExist = yield __1.prisma.user.findFirst({
            where: {
                email
            },
            select: {
                name: true,
                password: true,
                email: true,
                id: true
            }
        });
        if (!isUserExist) {
            res.status(404).json({
                success: false,
                error: "user doesn't exists"
            });
            return;
        }
        // compare password with hashed password from the database
        // let user={}
        if (isUserExist) {
            const isPasswordMatch = yield bcrypt_1.default.compare(password, isUserExist.password);
            if (!isPasswordMatch) {
                res.status(401).json({
                    success: false,
                    message: "password is not correct"
                });
                return;
            }
            isUserExist.password = "";
        }
        const user = {
            name: isUserExist.name,
            email: isUserExist.email,
        };
        //token generations
        const secret = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ isUserExist }, secret, { expiresIn: '1h' });
        // if successful return jwt token
        //add login information
        yield (0, user_controller_1.logUserActivity)(isUserExist.id, "LOGIN");
        res.status(200).json({
            message: "user login successful",
            success: true,
            user,
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "login failed",
            error: error
        });
    }
});
exports.login = login;
//logout
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                error: "User ID is required"
            });
            return;
        }
        yield (0, user_controller_1.logUserActivity)(userId, "LOGOUT");
        // remove token from the client
        res.status(200).json({
            success: true,
            message: "logout successful",
            token: ''
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "logout failed",
            error: error
        });
    }
});
exports.logout = logout;
