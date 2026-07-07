import { Router } from "express";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { userController } from "./user.controller";

const router = Router();

router.get("/", auth(UserRole.ADMIN), userController.getAllUsers);
router.patch("/:id", auth(UserRole.ADMIN), userController.updateUserStatus);

export const userRoutes = router;
