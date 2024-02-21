"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBLogger = void 0;
const logger_1 = require("../logger/logger");
class DBLogger {
    logQuery(query, parameters, queryRunner) {
        logger_1.logger.info(`query: ${query}, params: ${JSON.stringify(parameters)}`);
    }
    logQueryError(error, query, parameters, queryRunner) {
        logger_1.logger.error(`Error: ${JSON.stringify(error)}, query: ${query}, params: ${JSON.stringify(parameters)}`);
    }
    logQuerySlow(time, query, parameters, queryRunner) {
        logger_1.logger.warn(`Slow Query -> time: ${time.toFixed()}, query: ${query}, params: ${JSON.stringify(parameters)}`);
    }
    logSchemaBuild(message, queryRunner) {
        logger_1.logger.info(`Schema Build -> ${message}`);
    }
    logMigration(message, queryRunner) {
        logger_1.logger.info(`Migrations -> ${message}`);
    }
    log(level, message, queryRunner) {
        if (level === 'warn') {
            logger_1.logger.warn(message);
        }
        else {
            logger_1.logger.info(message);
        }
    }
}
exports.DBLogger = DBLogger;
