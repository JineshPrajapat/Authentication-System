import {Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";


const devError = (res:Response, error:any)=>{
    res.status(error.statusCode).json({
        status:error.statusCode,
        message:error.message,
        stackTrace:error.stack,
        error:error,
    });
}

const prodError = (res:Response, error:any)=>{
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message:error.message
        });
    }
    else{
        res.status(500).json({
            status:"error",
            message:"Something went wrong! Try again later"
        });
    }
}

const validationErrorHandler = (err:any)=>{
    const errors = Object.values(err.errors).map((val:any) => val.message);
    const errorMessages = errors.join(". ");
    const msg = `Invald input data: ${errorMessages}`;

    return new AppError(msg, 400);
}

const duplicateKeyErrorHandler = (err:any)=>{
    const field = Object.keys(err.keyValue).join(", ");
    const msg = `Duplicate field: ${field}. Please use another value!`;

    return new AppError(msg, 400);
}

const castErrorHandler= (err:any)=>{
    const msg = `Invalid value for ${err.path}:${err.value}`;

    return new AppError(msg, 400);
}


const errorHandlerMiddleware=(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
)=>{

    console.log("--errorHandlerMiddlerw----");
    console.log("error", err);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(!(err instanceof AppError)){

        console.log("not an appError")
        err = new AppError(
            err.message || "Something went wrong, try again later",
            err.statusCode
        )
    }

    if(process.env.NODE_ENV === "development"){
        devError(res, err);
    }
    else if(process.env.NODE_ENV === "production"){
        console.log("prod Error");
        
        if(err.name === "ValidationError"){
            err = validationErrorHandler(err);
        } else if(err.code === 11000){
            err = duplicateKeyErrorHandler(err);
        } else if(err.name === "CastError"){
            err = castErrorHandler(err);
        }

        prodError(res, err);   
    }
}

export default errorHandlerMiddleware;