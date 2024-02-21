"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDebugLogger = void 0;
/* eslint-disable no-console */
const chalk_1 = __importDefault(require("chalk"));
const abstract_custom_logger_1 = require("./abstract.custom.logger");
///////////////////////////////////////////////////////////////////////
class CustomDebugLogger extends abstract_custom_logger_1.AbstrctCustomLogger {
    constructor() {
        super();
        this.info = (str) => {
            const dateTime = new Date().toISOString();
            if (this._useConsole) {
                const str_ = chalk_1.default.hex('#AEADED')(`[${dateTime}] `) + chalk_1.default.bold.bgCyanBright(' INFO ') + ' ' + chalk_1.default.gray(str);
                console.log(chalk_1.default.green(str_));
            }
            else {
                const str_ = `[${dateTime}]  INFO  ${str}`;
                this._stream.write(str_);
            }
        };
        this.error = (str) => {
            const dateTime = new Date().toISOString();
            if (this._useConsole) {
                const str_ = chalk_1.default.hex('#AEADED')(`[${dateTime}] `) + chalk_1.default.bold.bgRedBright(' ERROR ') + ' ' + chalk_1.default.gray(str);
                console.log(chalk_1.default.red(str_));
            }
            else {
                const str_ = `[${dateTime}]  ERROR  ${str}`;
                this._stream.write(str_);
            }
        };
        this.warn = (str) => {
            const dateTime = new Date().toISOString();
            if (this._useConsole) {
                const str_ = chalk_1.default.hex('#AEADED')(`[${dateTime}] `) + chalk_1.default.bold.bgYellowBright(' WARN ') + ' ' + chalk_1.default.gray(str);
                console.log(chalk_1.default.yellow(str_));
            }
            else {
                const str_ = `[${dateTime}]  WARN  ${str}`;
                this._stream.write(str_);
            }
        };
        this.debug = (str) => {
            const dateTime = new Date().toISOString();
            if (this._useConsole) {
                const str_ = chalk_1.default.hex('#AEADED')(`[${dateTime}] `) + chalk_1.default.bold.bgBlueBright(' DEBUG ') + ' ' + chalk_1.default.gray(str);
                console.log(chalk_1.default.blue(str_));
            }
            else {
                const str_ = `[${dateTime}]  DEBUG  ${str}`;
                this._stream.write(str_);
            }
        };
    }
}
exports.CustomDebugLogger = CustomDebugLogger;
