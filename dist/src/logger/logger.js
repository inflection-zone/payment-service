"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const configuration_manager_1 = require("../config/configuration.manager");
const custom_debug_logger_1 = require("./custom/custom.debug.logger");
const custom_prod_logger_1 = require("./custom/custom.prod.logger");
const bunyan_debug_logger_1 = require("./bunyan/bunyan.debug.logger");
const bunyan_prod_logger_1 = require("./bunyan/bunyan.prod.logger");
const winston_debug_logger_1 = require("./winston/winston.debug.logger");
const winston_prod_logger_1 = require("./winston/winston.prod.logger");
///////////////////////////////////////////////////////////
class Logger {
}
exports.logger = Logger;
_a = Logger;
Logger.getLogger = () => {
    const provider = configuration_manager_1.ConfigurationManager.Logger;
    var logger_ = new custom_debug_logger_1.CustomDebugLogger();
    if (provider === 'Winston') {
        logger_ = new winston_debug_logger_1.WinstonDebugLogger();
        if (process.env.NODE_ENV === 'production') {
            logger_ = new winston_prod_logger_1.WinstonProdLogger();
        }
    }
    if (provider === 'Bunyan') {
        logger_ = new bunyan_debug_logger_1.BunyanDebugLogger();
        if (process.env.NODE_ENV === 'production') {
            logger_ = new bunyan_prod_logger_1.BunyanProdLogger();
        }
    }
    if (provider === 'Custom') {
        logger_ = new custom_debug_logger_1.CustomDebugLogger();
        if (process.env.NODE_ENV === 'production') {
            logger_ = new custom_prod_logger_1.CustomProdLogger();
        }
    }
    return logger_;
};
Logger._logger = _a.getLogger();
Logger.info = (str) => {
    var _b;
    (_b = _a._logger) === null || _b === void 0 ? void 0 : _b.info(str);
};
Logger.error = (str) => {
    var _b;
    (_b = _a._logger) === null || _b === void 0 ? void 0 : _b.error(str);
};
Logger.warn = (str) => {
    var _b;
    (_b = _a._logger) === null || _b === void 0 ? void 0 : _b.warn(str);
};
Logger.debug = (str) => {
    var _b;
    (_b = _a._logger) === null || _b === void 0 ? void 0 : _b.debug(str);
};
