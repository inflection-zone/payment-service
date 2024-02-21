//import{register as registerShippingRoute} from "../routes/ShippingRouter";
import { register as registerPaymentRoute} from"../api/routes";
import express from "express";

export class Router {
    private _app : express.Application 
    constructor(app:express.Application){
        this._app= app;
    //got refrence of ro
    }
    // initialize routers
    public init = async():Promise<boolean>=>{
        return new Promise((resolve,reject)=>{
            try{
                this._app.get("api/v5/",(req,res)=>{
                    res.send({message:'Demo Api service'})
                })
               
               registerPaymentRoute(this._app);
               

             
            }catch(erro){ console.log("Error initialing the routes")}
           
        })
    }
}
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