import { Router } from "express";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const router = Router();

router.get("/", categoryController.getAllCategories);

router.post("/create", auth(UserRole.ADMIN), categoryController.createCategory);

export const categoryRoutes = router;
