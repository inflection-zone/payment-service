"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const routes_1 = require("../api/routes");
const logger_1 = require("logger/logger");
class Router {
    constructor(app) {
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    this._app.get("api/v5/", (req, res) => {
                        res.send({ message: 'Demo Api service' });
                    });
                    (0, routes_1.register)(this._app);
                    resolve(true);
                }
                catch (error) {
                    logger_1.logger.error('Error initializing the router: ' + error);
                    reject(false);
                }
            });
        });
        this._app = app;
    }
}
exports.Router = Router;
