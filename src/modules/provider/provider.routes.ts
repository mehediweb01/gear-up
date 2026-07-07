import { Router } from "express";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { providerController } from "./provider.controller";

const router = Router();

router.post("/gear", auth(UserRole.PROVIDER), providerController.addGear);

router.patch(
  "/gear/:id",
  auth(UserRole.PROVIDER),
  providerController.updateGear,
);

router.delete(
  "/gear/:id",
  auth(UserRole.PROVIDER),
  providerController.deleteGear,
);

export const providerRoutes = router;
