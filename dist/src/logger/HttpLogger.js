"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpLogger = void 0;
const configuration_manager_1 = require("../config/configuration.manager");
const pinoHttp = __importStar(require("pino-http"));
const logger_1 = require("./logger");
//////////////////////////////////////////////////////////////////////////////
const expressLoggerFunc = (request, response, next) => {
    const start = Date.now();
    const ips = [
        request.header('x-forwarded-for') || request.socket.remoteAddress
    ];
    response.on('finish', () => {
        const elapsed = Date.now() - start;
        const txt = {
            method: request.method,
            url: request.originalUrl,
            params: request.params,
            query: request.query,
            statusCode: response.statusCode,
            statusMessage: response.statusMessage,
            duration: `${elapsed}ms`,
            headers: request.headers,
            requestBody: request.body,
            ips: request && request.ips.length > 0 ? request.ips : ips,
            contentType: response.type,
        };
        logger_1.logger.info(JSON.stringify(txt, null, 2));
    });
    next();
};
class HttpLogger {
}
exports.HttpLogger = HttpLogger;
HttpLogger.use = (app) => {
    const provider = configuration_manager_1.ConfigurationManager.Logger;
    if (provider === 'Winston') {
        app.use(expressLoggerFunc);
    }
    else if (provider === 'Bunyan') {
        app.use(expressLoggerFunc);
    }
    else if (provider === 'Pino') {
        const logger = pinoHttp.pinoHttp();
        app.use(logger);
    }
    else {
        app.use(expressLoggerFunc);
    }
};
