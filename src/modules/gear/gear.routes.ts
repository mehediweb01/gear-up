import { Router } from "express";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { gearController } from "./gear.controller";

const router = Router();

router.post("/add", auth(UserRole.PROVIDER), gearController.addGear);
router.patch("/:id", auth(UserRole.PROVIDER), gearController.updateGear);
router.delete("/:id", auth(UserRole.PROVIDER), gearController.deleteGear);
router.get("/", gearController.getAllGears);

export const gearRoutes = router;
