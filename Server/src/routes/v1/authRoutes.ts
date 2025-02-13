import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import * as authController from "../../controller/auth";

const router = express.Router();


router.post("/register",asyncHandler(authController.register) );
router.post("/verify-email", asyncHandler(authController.verfiyEmail));
router.post("/login", asyncHandler(authController.login) );
router.post("/reset-password-token", asyncHandler(authController.resetPasswordToken));
router.post("/reset-password", asyncHandler(authController.resetPassword));
router.post("/refreshTokn", asyncHandler(authController.handleRefreshToken));
router.post("/logout", asyncHandler(authController.logout));


export default router;