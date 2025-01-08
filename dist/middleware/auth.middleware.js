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
exports.authorization = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jwt = __importStar(require("jsonwebtoken"));
dotenv_1.default.config();
const authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get the token from the request header, cookies, or body
        const authHeader = req.headers.authorization;
        const token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))
            ? authHeader.split(" ")[1]
            : ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || req.body.token;
        if (!token) {
            res.status(401).json({
                success: false,
                error: "Token is missing",
            });
            return;
        }
        const secret = process.env.JWT_SECRET_KEY;
        if (!secret) {
            res.status(500).json({
                success: false,
                error: "Server configuration error",
            });
            return;
        }
        const decoded = jwt.verify(token, secret);
        if (decoded) {
            req.userId = decoded.isUserExist.id;
            req.email = decoded.isUserExist.email;
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Internal Server Error: ${error}`,
        });
    }
});
exports.authorization = authorization;
