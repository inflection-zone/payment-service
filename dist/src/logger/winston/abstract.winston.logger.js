"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstrctWinstonLogger = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
///////////////////////////////////////////////////////////////////////
class AbstrctWinstonLogger {
    //#endregion
    constructor() {
        //#region  Privates
        this._folder = path_1.default.join(__dirname, '../../../logs');
        this._logFileName = 'debug.log';
        this._logFile = path_1.default.join(this._folder, this._logFileName);
        this._dailyRotateFile = new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(this._folder, 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '30m',
            maxFiles: '14d',
            dirname: this._folder,
        });
        //Use own format instead of json
        this._customFormat = winston_1.default.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} ${level}: ${message}`;
        });
        this._logger = null;
        this._logLevels = {
            fatal: 0,
            error: 1,
            warn: 2,
            info: 3,
            debug: 4,
            trace: 5,
        };
        if (!fs_1.default.existsSync(this._folder)) {
            fs_1.default.mkdirSync(this._folder);
        }
    }
}
exports.AbstrctWinstonLogger = AbstrctWinstonLogger;
