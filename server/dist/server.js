"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const port = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        app_1.default.listen(port, () => {
            console.log(`Server started at port ${port}`);
        });
    }
    catch (error) {
        console.error("Failed to start at port : " + port);
        process.exit(1);
    }
};
startServer();
