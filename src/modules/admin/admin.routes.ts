import { Router } from "express";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { adminController } from "./admin.controller";

const router = Router();

router.post(
  "/category/create",
  auth(UserRole.ADMIN),
  adminController.createCategory,
);

export const adminRoutes = router;
