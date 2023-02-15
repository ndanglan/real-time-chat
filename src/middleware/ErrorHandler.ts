import {  NextFunction, Request, Response } from "express";

const ErrorHandler = (err:any,req:Request,res:Response,next:NextFunction)=>{
  if (err.statusCode) {
    res.status(err.statusCode).send({ error: err.message });
  } else {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

export default ErrorHandler