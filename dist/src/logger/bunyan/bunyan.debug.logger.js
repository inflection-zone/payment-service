"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BunyanDebugLogger = void 0;
const bunyan_1 = __importDefault(require("bunyan"));
const abstract_bunyan_logger_1 = require("./abstract.bunyan.logger");
///////////////////////////////////////////////////////////////////////
class BunyanDebugLogger extends abstract_bunyan_logger_1.AbstrctBunyanLogger {
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
            name: `[${process.env.NODE_ENV}-${process.env.SERVICE_NAME}]`,
            streams: [
                // Add other streams as needed
                {
                    level: 'info',
                    type: 'raw', // Using 'raw' type for custom streams
                    stream: this._consolePrettyStream,
                },
            ],
            serializers: {
                // Define your serializers here
                req: bunyan_1.default.stdSerializers.req,
                res: bunyan_1.default.stdSerializers.res,
            },
        });
    }
}
exports.BunyanDebugLogger = BunyanDebugLogger;
// export class BunyanDebugLogger extends AbstrctBunyanLogger {
//     constructor() {
//         super();
//         this._logger = bunyan.createLogger({
//             name    : `[${process.env.NODE_ENV}-${process.env.SERVICE_NAME}]`,
//             streams : [
//                 // {
//                 //     level : 'debug',
//                 //     path  : this._logFile,
//                 // },
//                 {
//                     level  : 'info',
//                     //stream : process.stdout,
//                     stream : this._consolePrettyStream,
//                     format : '[@time $level] $msg'
//                 }
//             ]
//         });
//     }
//     info = (str: string) => {
//         this._logger?.info(str);
//     };
//     error = (str: string) => {
//         this._logger?.error(str);
//     };
//     warn = (str: string) => {
//         this._logger?.warn(str);
//     };
//     debug = (str: string) => {
//         this._logger?.debug(str);
//     };
// }
