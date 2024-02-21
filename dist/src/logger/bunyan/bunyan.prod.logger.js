"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BunyanProdLogger = void 0;
const bunyan_1 = __importDefault(require("bunyan"));
const abstract_bunyan_logger_1 = require("./abstract.bunyan.logger");
///////////////////////////////////////////////////////////////////////
class BunyanProdLogger extends abstract_bunyan_logger_1.AbstrctBunyanLogger {
    constructor() {
        super();
        this.info = (str) => {
            var _a;
            (_a = this._logger) === null || _a === void 0 ? void 0 : _a.info(str);
        };
        this.error = (str) => {
            var _a;
            (_a = this._logger) === null || _a === void 0 ? void 0 : _a.error(str);
        };
        this.warn = (str) => {
            var _a;
            (_a = this._logger) === null || _a === void 0 ? void 0 : _a.warn(str);
        };
        this.debug = (str) => {
            var _a;
            (_a = this._logger) === null || _a === void 0 ? void 0 : _a.debug(str);
        };
        this._logger = bunyan_1.default.createLogger({
            name: 'default',
            streams: [
                {
                    level: 'debug',
                    path: this._logFile,
                },
                {
                    level: 'info',
                    stream: process.stdout,
                }
            ]
        });
    }
}
exports.BunyanProdLogger = BunyanProdLogger;
