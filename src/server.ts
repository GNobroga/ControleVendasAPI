import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import HandleError from './shared/errors/HandleError';
import sequelize from './config/db/connection';
import routes from './shared/routes';
import { errors } from 'celebrate';
import './config/uploadConfig';
import path from 'path';
import Order from './entities/Order';
import { Product } from './entities/Product';

(async () => {
    try {
        await sequelize.sync({ force: true, });
        Server ();
    } catch (e) {
       console.log('Unable connect the database.');
    }
})();


function Server () {
    const app = express();

    app.use('/public', express.static(path.resolve('public')))
    app.use(express.urlencoded({ extended: true, }))
    app.use(express.json());
    app.use(cors());
    
    app.use('/api', routes);

    app.use(errors());

    app.use((error: any, req: Request, res: Response, next: NextFunction) => {
        const responseError = {
            status: 'error',
            message: 'Internal server error',
        };

        let statusCode = 500;
        if (error instanceof HandleError) {
            statusCode = error.statusCode;
            responseError.message = error.message;
        } else if (error instanceof Error) {
            responseError.message = error.message;
        }

        return res.status(statusCode).json(responseError);
    });

  
    app.listen(3333, () => {
        console.log(`The server is open on port 3333 at http://localhost:3333`);
    });
};

 
