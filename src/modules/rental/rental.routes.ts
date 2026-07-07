import { Router } from "express";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { rentalController } from "./rental.controller";

const router = Router();

router.get(
  "/provider",
  auth(UserRole.PROVIDER),
  rentalController.getIncomingOrders,
);

router.post("/create", auth(UserRole.CUSTOMER), rentalController.createOrder);
router.get("/", auth(UserRole.CUSTOMER), rentalController.getUserOrders);
router.get("/:id", auth(UserRole.CUSTOMER), rentalController.getOrderDetails);

export const rentalRoutes = router;
