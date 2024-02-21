import bunyan from 'bunyan';
import { AbstrctBunyanLogger } from './abstract.bunyan.logger';

///////////////////////////////////////////////////////////////////////

export class BunyanDebugLogger extends AbstrctBunyanLogger {

    constructor() {
        super();

        this._logger = bunyan.createLogger({
            name: `[${process.env.NODE_ENV}-${process.env.SERVICE_NAME}]`,
            streams: [
                // Add other streams as needed
                {
                    level: 'info',
                    type: 'raw',  // Using 'raw' type for custom streams
                    stream: this._consolePrettyStream,
                },
            ],
            serializers: {
                // Define your serializers here
                req: bunyan.stdSerializers.req,
                res: bunyan.stdSerializers.res,
            },
        });
    }

    info = (str: string) => {
        this._logger?.info(str);
    };

    error = (str: string) => {
        this._logger?.error(str);
    };

    warn = (str: string) => {
        this._logger?.warn(str);
    };

    debug = (str: string) => {
        this._logger?.debug(str);
    };

}

// export class BunyanDebugLogger extends AbstrctBunyanLogger {

//     constructor() {
//         super();

//         this._logger = bunyan.createLogger({
//             name    : `[${process.env.NODE_ENV}-${process.env.SERVICE_NAME}]`,
//             streams : [
//                 // {
//                 //     level : 'debug',
//                 //     path  : this._logFile,
//                 // },
//                 {
//                     level  : 'info',
//                     //stream : process.stdout,
//                     stream : this._consolePrettyStream,
//                     format : '[@time $level] $msg'
//                 }
//             ]
//         });
//     }

//     info = (str: string) => {
//         this._logger?.info(str);
//     };

//     error = (str: string) => {
//         this._logger?.error(str);
//     };

//     warn = (str: string) => {
//         this._logger?.warn(str);
//     };

//     debug = (str: string) => {
//         this._logger?.debug(str);
//     };

// }
