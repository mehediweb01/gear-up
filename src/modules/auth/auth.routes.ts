import { Router } from "express";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { authController } from "./auth.controller";

const router = Router();

router.post("/login", authController.userLogin);

router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  authController.getMe,
);

export const authRoutes = router;
