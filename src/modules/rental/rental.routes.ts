import { Router } from "express";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { rentalController } from "./rental.controller";

const router = Router();

router.post("/create", auth(UserRole.CUSTOMER), rentalController.createOrder);

export const rentalRoutes = router;
