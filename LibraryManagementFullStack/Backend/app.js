import express from 'express';
import {config} from 'dotenv';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './Database/db.js';
import userRoutes from './Routes/user.routes.js';
import bookRoutes from './Routes/book.routes.js';
import borrowRoutes from './Routes/borrow.routes.js';
import "colors";
import { notifyUser } from './Services/notifyUser.js';
import { removeUnverifiedAccounts } from './Services/removeUnverifiedAccounts.js';

const app = express();

config({
    path: './config/config.env'
})

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}))
 //Define all the routes.
 app.use("/api/v1/user",userRoutes);
 app.use("/api/v1/book",bookRoutes);
 app.use("/api/v1/borrow",borrowRoutes);

notifyUser();
removeUnverifiedAccounts();
connectDB();



 export{app};