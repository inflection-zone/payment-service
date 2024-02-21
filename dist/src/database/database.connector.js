"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Source = exports.DBConnector = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
require("reflect-metadata");
const database_config_1 = require("./database.config");
const typeorm_1 = require("typeorm");
const database_logger_1 = require("./database.logger");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const order_model_1 = require("./models/order.model");
const payment_model_1 = require("./models/payment.model");
const user_model_1 = require("./models/user.model");
///////////////////////////////////////////////////////////////////////////////////
console.info(`environment : ${process.env.NODE_ENV}`);
console.info(`db name     : ${database_config_1.Config.database}`);
console.info(`db username : ${database_config_1.Config.username}`);
console.info(`db host     : ${database_config_1.Config.host}`);
///////////////////////////////////////////////////////////////////////////////////
class DatabaseConnector {
    static getFoldersRecursively(location) {
        const items = fs_1.default.readdirSync(location, { withFileTypes: true });
        let paths = [];
        for (const item of items) {
            if (item.isDirectory()) {
                const fullPath = path_1.default.join(location, item.name);
                const childrenPaths = this.getFoldersRecursively(fullPath);
                paths = [
                    ...paths,
                    fullPath,
                    ...childrenPaths,
                ];
            }
        }
        return paths;
    }
}
exports.DBConnector = DatabaseConnector;
_a = DatabaseConnector;
DatabaseConnector._basePath = path_1.default.join(process.cwd(), 'src/database/models').replace(/\\/g, '/');
DatabaseConnector._source = new typeorm_1.DataSource({
    name: database_config_1.Config.dialect,
    type: database_config_1.Config.dialect,
    host: database_config_1.Config.host,
    port: database_config_1.Config.port,
    username: database_config_1.Config.username,
    password: database_config_1.Config.password,
    database: database_config_1.Config.database,
    synchronize: true,
    entities: [
        order_model_1.Order,
        payment_model_1.Payment,
        user_model_1.User
    ],
    migrations: [],
    subscribers: [],
    logger: new database_logger_1.DBLogger(),
    logging: true,
    poolSize: database_config_1.Config.pool.max,
    cache: true,
});
DatabaseConnector.initialize = () => {
    return new Promise((resolve, reject) => {
        _a._source
            .initialize()
            .then(() => {
            console.info('Database connection has been established successfully.');
            resolve(true);
        })
            .catch(error => {
            console.error('Unable to connect to the database:' + error.message);
            reject(false);
        });
    });
};
///////////////////////////////////////////////////////////////////////////////////
const Source = DatabaseConnector._source;
exports.Source = Source;
