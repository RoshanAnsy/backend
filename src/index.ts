import {  PrismaClient } from '@prisma/client';
import express, { Response,Request } from 'express';
import dotenv from "dotenv";
import AuthRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from "cors"
dotenv.config();
const app = express();
export const prisma=new PrismaClient();
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));

app.get('/',(req:Request,res:Response)=>{
    res.send("server is running");
})
app.use('/',AuthRoute);
app.use("/",userRoute)

app.listen(process.env.PORT,() => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
