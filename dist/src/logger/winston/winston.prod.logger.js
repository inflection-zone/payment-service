"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonProdLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const abstract_winston_logger_1 = require("./abstract.winston.logger");
///////////////////////////////////////////////////////////////////////
class WinstonProdLogger extends abstract_winston_logger_1.AbstrctWinstonLogger {
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
        this._logger = winston_1.default.createLogger({
            levels: this._logLevels,
            level: 'warn',
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), 
            //winston.format.timestamp(),
            //this._customFormat,
            winston_1.default.format.json()),
            transports: [
                // new winston.transports.File({ filename: logFile, level: 'silly' }),
                // new winston.transports.Console({
                //     handleExceptions : true,
                // }),
                this._dailyRotateFile,
            ]
        });
    }
}
exports.WinstonProdLogger = WinstonProdLogger;
