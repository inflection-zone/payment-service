"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstrctCustomLogger = void 0;
const abstract_logger_1 = require("../abstract.logger");
const fs_1 = __importDefault(require("fs"));
///////////////////////////////////////////////////////////////////////
class AbstrctCustomLogger extends abstract_logger_1.AbstrctLogger {
    constructor() {
        super();
        this._useConsole = true;
        this._stream = fs_1.default.createWriteStream(this._logFile, {
            'flags': 'a',
            'encoding': null,
            'mode': 0o666
        });
    }
}
exports.AbstrctCustomLogger = AbstrctCustomLogger;
