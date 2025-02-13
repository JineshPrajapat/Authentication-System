import mongoose, { Schema } from "mongoose";
import { AccountStatusEnum } from "../types/enums";

interface IUser{
    email:string;
    password:string;
    name:string;
    status: AccountStatusEnum;
    verificationToken: string | null;
    verificationTokenExpiration:Date | null;
    refreshToken:string | null;
    resetPasswordToken:string | null;
    resetPasswordTokenExpires: Date;
}

const UserSchema = new Schema<IUser>({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true, 
        trim:true
    },
    status:{
        type:String,
        enum:Object.values(AccountStatusEnum),
        default:AccountStatusEnum.PENDING_VERIFICATION,
    },
    verificationToken:{
        type:String,
        require:true
    },
    verificationTokenExpiration:{
        type:Date,
        required:true,
    },
    refreshToken:{
        type:String
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordTokenExpires:{
        type:Date
    }
},{
    timestamps:true
});

export const User = mongoose.model<IUser>("User", UserSchema);

