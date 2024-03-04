"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinoProdLogger = void 0;
const pino_1 = __importDefault(require("pino"));
const abstract_pino_logger_1 = require("./abstract.pino.logger");
///////////////////////////////////////////////////////////////////////
class PinoProdLogger extends abstract_pino_logger_1.AbstrctPinoLogger {
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
        this._logger = (0, pino_1.default)({
            transport: {
                target: 'pino-pretty',
                //target : this._logFile
            },
            options: {
                translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
                ignore: 'pid',
            }
        }
        //, pino.destination(this._logFile) // Another way to specify logfile
        );
        this._logger = (0, pino_1.default)({
            level: 'warn',
            // transport : {
            //     target : 'pino-pretty',
            //     //target : this._logFile
            // },
            options: {
                append: true,
                colorizeObjects: true,
                colorize: true,
                //translateTime   : false,
                //timestampKey    : 'time',
                ignore: 'pid',
            }
        }
        //, pino.destination(this._logFile) // Another way to specify logfile
        );
    }
}
exports.PinoProdLogger = PinoProdLogger;
