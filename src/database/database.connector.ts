/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Config } from './database.config';
import { DataSource } from "typeorm";
 import { DBLogger } from "./database.logger";
 import path from "path";
 import fs from 'fs';
import { Order } from "./models/order.model";
import { Payment } from "./models/payment.model";
import { User } from "./models/user.model";
///////////////////////////////////////////////////////////////////////////////////

console.info(`environment : ${process.env.NODE_ENV}`);
console.info(`db name     : ${Config.database}`);
console.info(`db username : ${Config.username}`);
console.info(`db host     : ${Config.host}`);

///////////////////////////////////////////////////////////////////////////////////

class DatabaseConnector {

    static _basePath = path.join(process.cwd(), 'src/database/models').replace(/\\/g, '/');

    static _source = new DataSource({
        name: Config.dialect,
        type: Config.dialect,
        host: Config.host,
        port: Config.port,
        username: Config.username,
        password: Config.password,
        database: Config.database,
        synchronize: true,
        entities: [
           Order,
           Payment,
           User
        ],
        migrations: [],
        subscribers: [],
        logger: new DBLogger(),
        logging: true,
        poolSize: Config.pool.max,
        cache: true,
    });

    static getFoldersRecursively(location: string) {
        const items = fs.readdirSync(location, { withFileTypes: true });
        let paths = [];
        for (const item of items) {
            if (item.isDirectory()) {
                const fullPath = path.join(location, item.name);
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

    static initialize = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            this._source
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

}

///////////////////////////////////////////////////////////////////////////////////

const Source = DatabaseConnector._source;

export { DatabaseConnector as DBConnector, Source };
