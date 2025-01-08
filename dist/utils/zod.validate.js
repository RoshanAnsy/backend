"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginZodSchema = exports.signUpZodSchema = void 0;
const zod_1 = require("zod");
exports.signUpZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    conformPassword: zod_1.z.string().min(8),
});
exports.loginZodSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
