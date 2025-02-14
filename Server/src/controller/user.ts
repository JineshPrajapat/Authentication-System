import { Request, Response, NextFunction } from "express";
import { User } from "../model/user";
import mongoose from "mongoose";
import AppError from "../utils/appError";

export const userInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    const user = await User.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(userId) }
        },
        {
            $project: {
                email: 1,
                createdAt: 1,
                status: 1
            }
        }
    ]);

    if (!user.length)
        throw new AppError("User not found", 401);

    return res.status(200).json({
        success: true,
        user: user[0]
    })
}

export const allUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { date, status, name, sortBy, cursor } = req.query;

    const limit = 10;

    console.log("status", status, cursor)

    const users = await User.aggregate([
        {
            $match: {
                ...(name ? { "name": { $regex: name, $options: 'i' } } : {}),
                ...(status ? { "status": status } : {}),
                ...(date ? {
                    "createdAt": {
                        $gte: new Date(new Date(String(date)).setHours(0, 0, 0, 0)),
                        $lt: new Date(new Date(String(date)).setHours(23, 59, 59, 999)),
                    }
                } : {}),
            }
        },
        ...(cursor ? [
            {
                $match: {
                    _id: { $gt: new mongoose.Types.ObjectId(String(cursor)) }
                }
            }
        ] : []),
        {
            $sort: { createdAt: sortBy === 'asc' ? 1 : -1 }
        },
        {
            $limit: limit
        },
        {
            $project: {
                _id: 1,
                email: 1,
                name: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    if (!users.length)
        throw new AppError("Users not found", 404);

    return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        users
    })

}

export const editProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    const { name, profession, address } = req.body;

    let updateFields: { name?: string, profession?: string, address?: string } = {};

    if (name) updateFields.name = name;
    if (profession) updateFields.profession = profession;
    if (address) updateFields.address = address;

    const updatedUser = await User.findByIdAndUpdate(
        new mongoose.Types.ObjectId(userId),
        {
            $set: updateFields
        },
        { new: true }
    );

    if (!updatedUser)
        throw new AppError("User not found", 404);

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        updatedUser
    })
}

export const deleteAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    const isDeletedUser = await User.findByIdAndDelete(
        new mongoose.Types.ObjectId(userId)
    );

    if (!isDeletedUser)
        throw new AppError("User not found", 404);

    res
        .clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        })
        .clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        })

    return res.status(200).json({
        success: true,
        message: "Account deleted successfully"
    });
}