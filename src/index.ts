console.log("Hello")
import dotenv from 'dotenv';
dotenv.config();

import Application from './app';


(async () => {
    const app = Application.instance();
    await app.start();
})();





//npm init -y  
// npm install --save-dev ts-node typescript nodemon @types/express
// npm install express
// npm install -g typescript
// tsc --version
// tsc --init 