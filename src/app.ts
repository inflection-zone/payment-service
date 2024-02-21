//class
//only one instance coz maintain one instance of app ..create onlye single instance

import express from "express";
import "reflect-metadata";
import { Router } from "./startup/router";
import { createConnection } from "typeorm";
import { resolve } from "path";
import { rejects } from "assert";

export default class Application {
  public _app: express.Application = null;
  private _router: Router = null;
 
  private static _instance: Application = null; // type Application
  private constructor() {
    this._app = express();
   // this._app.use(express.json());
    this._router = new Router(this._app);
  }

  public static instance(): Application {
    // if(this._instance==null){
    //     this._instance=new this();//crrate instance of application class
    //     return this._instance;
    // }
    // else{
    //     return this._instance;//retun not new instance
    // }
    return this._instance || (this._instance = new this());
  }
  // call init method of router class(router.ts)
  start = async () => {
    try {
      
      this._app.use(express.json());
      this._app.use(express.urlencoded());
      this._router.init();
      this.listen();
        //after initalizing routers ...call listen  method
        
    } catch (error) {}
  };
  //listen posrt no
  private listen = async () => {
    return new Promise((resolve, reject) => {
      try {
        this._app.listen(process.env.PORT, () => {
          console.log(`Example app listening on port ${process.env.PORT}`);
        });
      } catch (error) {
        console.log("Error>>");
      }
    });
  };
}

// created router class define route handler and register all routers in app.ts
