import { Router } from "express";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/checkout",
  auth(UserRole.CUSTOMER),
  paymentController.createPayment,
);

router.post("/webhook", paymentController.stripeWebhook);

router.get("/", auth(UserRole.CUSTOMER), paymentController.getUserPayments);

export const paymentRoutes = router;
