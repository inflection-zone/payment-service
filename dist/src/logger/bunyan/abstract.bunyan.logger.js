"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstrctBunyanLogger = void 0;
const abstract_logger_1 = require("../abstract.logger");
const bunyan_prettystream_1 = __importDefault(require("bunyan-prettystream"));
///////////////////////////////////////////////////////////////////////
class AbstrctBunyanLogger extends abstract_logger_1.AbstrctLogger {
    constructor() {
        super();
        this._consolePrettyStream = new bunyan_prettystream_1.default();
        this._consolePrettyStream.pipe(process.stdout);
    }
}
exports.AbstrctBunyanLogger = AbstrctBunyanLogger;
