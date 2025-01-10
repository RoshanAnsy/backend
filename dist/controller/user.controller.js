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
exports.logUserActivity = exports.getAllUsers = exports.getUserLogs = void 0;
const __1 = require("..");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const logUserActivity = (userId, action) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield __1.prisma.log.create({
            data: {
                userId,
                action,
            }
        });
    }
    catch (error) {
        console.error("Error logging user activity", error);
    }
});
exports.logUserActivity = logUserActivity;
const getUserLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = req.userId;
        if (!Id) {
            res.status(400).json({
                success: false,
                error: "User ID is required"
            });
            return;
        }
        const logs = yield __1.prisma.user.findUnique({
            where: {
                id: Id,
            },
            select: {
                name: true,
                email: true,
                logs: {
                    select: {
                        action: true,
                        timestamp: true,
                    },
                    orderBy: {
                        timestamp: 'desc',
                    },
                },
            },
        });
        if (!logs) {
            res.status(404).json({
                success: false,
                error: "No logs found"
            });
            return;
        }
        res.status(200).json({
            message: "User logs get successfully",
            success: true,
            logs,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "User logs get failed",
            success: false,
            error: `internal error: ${error}`
        });
    }
});
exports.getUserLogs = getUserLogs;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, skip } = req.query;
        const TotalSkip = Number(skip);
        const TotalLimit = Number(limit);
        const users = yield __1.prisma.user.findMany({
            skip: TotalSkip,
            take: TotalLimit,
            orderBy: {
                id: 'asc'
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });
        if (!users) {
            res.status(404).json({
                success: false,
                error: "No users found"
            });
            return;
        }
        res.status(200).json({
            message: "All user get successful",
            success: true,
            users
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get users",
            error: `internal server error ${error}`
        });
    }
});
exports.getAllUsers = getAllUsers;
