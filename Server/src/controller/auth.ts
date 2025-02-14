import { Response, Request, NextFunction } from "express";
import AppError from "../utils/appError";
import bcrypt from "bcrypt";
import { User } from "../model/user";
import crypto from "crypto";
import mailSender from "../utils/mailSender";
import { AccountStatusEnum } from "../types/enums";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwtUtils";
import { resetPasswordTemplate } from "../mails/resetPasswordTemplate";
import { emailVerificationTemplate } from "../mails/emailVerificationTemplate";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password, name } = req.body

    if (!email || !password)
        return next(new AppError("Email and Password are required", 400));
        // throw new AppError("Email and Password are required", 400);

    const userExist = await User.exists({ email });
    if (userExist)
        throw new AppError("User already exist", 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiration = Date.now() + 1800000                          // 30 minutes for expiration

    const user = await User.create({
        email,
        name,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiration
    });

    if (!user)
        throw new AppError("Failed to create user", 500);

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const emailInfo = await mailSender(email, "Verify Your Email", emailVerificationTemplate(email, verificationLink));
    if (!emailInfo)
        throw new AppError("Failed to send email", 500);

    return res.status(201).json({
        success: true,
        message: "User registered successfully, verify emial"
    });
}

export const verfiyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { verificationToken } = req.query;

    console.log("req.query", req.query);
    console.log("verificaton", verificationToken);

    if (!verificationToken)
        throw new AppError("Field not found", 400);

    const user = await User.findOneAndUpdate(
        {
            verificationToken,
            verificationTokenExpiration: { $gt: Date.now() }
        },
        {
            $set: {
                status: AccountStatusEnum.ACTIVE,
                verificationToken: null,
                verificationTokenExpiration: null,
            }
        },
        { new: true }
    );

    if (!user)
        throw new AppError("Invalid or expired verification token", 400);

    return res.status(200).json({
        success: true,
        message: "User verified Successfully"
    });
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;

    if (!email || !password)
        throw new AppError("Field not found", 400);

    const user = await User.findOne({ email });
    if (!user)
        throw new AppError("User is not registerd", 404);

    if (user.status === AccountStatusEnum.PENDING_VERIFICATION)
        throw new AppError("Email is not verified, Please verify email", 400);

    if (!(await bcrypt.compare(password, user.password)))
        throw new AppError("Invalid password", 403);

    const accessToken = generateAccessToken({ id: String(user._id), status: user.status });
    const refreshToken = generateRefreshToken({ id: String(user._id), status: user.status });

    await User.findByIdAndUpdate(
        user._id,
        { refreshToken: refreshToken }
    );

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
    });

    res.status(200).json({
        success: true,
        message: "Login successfully"
    });
}

export const handleRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        throw new AppError("Refresh Token is required", 403);

    try {
        const user = await User.findOne({ refreshToken });
        if (!user)
            throw new AppError("Invalid refresh Token", 403);

        const payload = verifyRefreshToken(refreshToken);
        const accessToken = generateAccessToken({
            id: payload.id,
            status: payload.status
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.status(200).json({ accessToken: accessToken });

    }
    catch (err: any) {
        next(new AppError("Invalid Refresh TOken", 403));
    }
}

export const resetPasswordToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email } = req.body;

    if (!email)
        throw new AppError("Email not found", 400);

    const user = await User.findOne({ email });
    if (!user)
        throw new AppError("Email is not registered", 404);

    const resetPasswordToken = crypto.randomBytes(32).toString('hex');

    const updatedUser = await User.findOneAndUpdate(
        { email: email },
        {
            resetPasswordToken,
            resetPasswordTokenExpires: Date.now() + 10 * 60 * 1000,                     // 10 minutes
        },
        { new: true }
    );

    const resetPasswordLink: string = `${process.env.FRONTEND_BASE_URL}/reset-password/${resetPasswordToken}`;

    if (!updatedUser)
        throw new AppError("Failed to create Reset password link", 501);

    const emailInfo = await mailSender(email, 'Reset Password', resetPasswordTemplate(email, resetPasswordLink))
    if (!emailInfo) {
        return next(
            new AppError("Something went wrong while sending mail", 500)
        );
    }

    return res.status(200).json({
        success: true,
        message: "Reset Passwprd link is sended on registered email",
    })


}

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { password, confirmPassword, token } = req.body;

    if (!password || !confirmPassword || !token)
        throw new AppError("Field not found", 400);
    if(password !== confirmPassword)
        throw new AppError("Password do not match", 400);

    const user = await User.findOne({ resetPasswordToken: token });
    if (!user)
        throw new AppError("User not found", 404);

    if (user?.resetPasswordTokenExpires.getTime() < Date.now())
        throw new AppError("Link is expired, try again", 402);

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findOneAndUpdate(
        { resetPasswordToken: token },
        {
            password: hashedPassword,
            resetPasswordToken: null
        },
        { new: true }
    );

    if (!updatedUser)
        throw new AppError("Failed to update Password", 410);

    return res.status(200).json({
        success: true,
        message: "Password updated successfuly"
    })
}

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        throw new AppError("Refresh Token is  required", 400);

    const user = await User.findOneAndUpdate(
        { refreshToken },
        {
            $unset: {
                refreshToken: null
            }
        },
        { new: true }
    );

    if (!user)
        throw new AppError("Invalid Refresh Token", 400);

    res
        .clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        .clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })

    return res.status(200).json({ success:true, message: "Logged out successfully" });
}

