"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstrctLogger = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
///////////////////////////////////////////////////////////////////////
class AbstrctLogger {
    //#endregion
    constructor() {
        //#region  Privates
        this._folder = path_1.default.join(process.cwd(), 'logs');
        this._logFileName = 'debug.log';
        this._logFile = path_1.default.join(this._folder, this._logFileName);
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
exports.AbstrctLogger = AbstrctLogger;
