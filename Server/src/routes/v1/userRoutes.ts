import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import asyncHandler from "../../utils/asyncHandler";
import * as userController from "../../controller/user";

const router = express.Router();

router.get("/", authenticate, asyncHandler(userController.userInfo));
router.get("/allUsers", authenticate, asyncHandler(userController.allUser));


export default router;