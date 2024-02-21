"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonDebugLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const abstract_winston_logger_1 = require("./abstract.winston.logger");
///////////////////////////////////////////////////////////////////////
class WinstonDebugLogger extends abstract_winston_logger_1.AbstrctWinstonLogger {
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
        const format = winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.label({ label: `[${process.env.NODE_ENV}-${process.env.SERVICE_NAME}]` }), winston_1.default.format.timestamp({ format: 'YY-MM-DD HH:MM:SS' }), winston_1.default.format.printf((x) => `${x.timestamp} ${x.label} ${x.level} : ${x.message}`));
        winston_1.default.addColors({
            info: 'blue',
            warn: 'yellow',
            error: 'bold red',
            debug: 'green',
        });
        this._logger = winston_1.default.createLogger({
            levels: this._logLevels,
            level: 'debug',
            // format : winston.format.combine(
            //     winston.format.colorize({
            //         all : true
            //     }),
            //     winston.format.timestamp({
            //         format : `YY-MM-DD HH:mm:ss`
            //     }),
            //     this._customFormat,
            //     winston.format.json()
            // ),
            transports: [
                // new winston.transports.File({ filename: logFile, level: 'silly' }),
                new winston_1.default.transports.Console({
                    handleExceptions: true,
                    format
                }),
                //this._dailyRotateFile,
            ]
        });
    }
}
exports.WinstonDebugLogger = WinstonDebugLogger;
