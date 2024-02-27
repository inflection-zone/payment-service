import { register as registerPaymentRoute } from "../api/routes";
import express from "express";
import { logger } from "logger/logger";

export class Router {
    private _app: express.Application
    constructor(app: express.Application) {
        this._app = app;
    }

    public init = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {
                this._app.get("api/v5/", (req, res) => {
                    res.send({ message: 'Demo Api service' })
                })
                registerPaymentRoute(this._app);
                resolve(true);

            } catch (error) { 
                logger.error('Error initializing the router: ' + error);
                reject(false);
             }

        })
    }
}
