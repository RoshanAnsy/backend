import {  PrismaClient } from '@prisma/client';
import express, { Response } from 'express';
import dotenv from "dotenv";
import AuthRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
dotenv.config();
const app = express();
export const prisma=new PrismaClient();


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));

app.get('/',(res:Response)=>{
    res.send("server is running");
})
app.use('/',AuthRoute);
app.use("/",userRoute)

app.listen(process.env.PORT,() => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
