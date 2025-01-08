"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', (res) => {
    res.send("server is running");
});
app.use('/', auth_route_1.default);
app.use("/", user_route_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
