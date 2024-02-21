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
//import{register as registerShippingRoute} from "../routes/ShippingRouter";
const routes_1 = require("../api/routes");
class Router {
    constructor(app) {
        // initialize routers
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    this._app.get("api/v5/", (req, res) => {
                        res.send({ message: 'Demo Api service' });
                    });
                    (0, routes_1.register)(this._app);
                }
                catch (erro) {
                    console.log("Error initialing the routes");
                }
            });
        });
        this._app = app;
        //got refrence of ro
    }
}
exports.Router = Router;
// import express from "express";
// export class Router {
//     private _app = null;
//     constructor(app: express.Application) {
//         this._app = app;
//     }
//     public init = async (): Promise<boolean> => {
//         return new Promise((resolve, reject) => {
//             try {
//                 //Handling the base route
//                 this._app.get('/api/v1/', (req, res) => {
//                     res.send({
//                         message : `Careplan Service API [Version ${process.env.API_VERSION}]`,
//                     });
//                 });
//                // registerUserRoutes(this._app);
//                 resolve(true);
//             } catch (error) {
//                 logger.error('Error initializing the router: ' + error.message);
//                 reject(false);
//             }
//         });
//     };
// }
