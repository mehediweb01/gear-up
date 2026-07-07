import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import config from "./config";
import { authRoutes } from "./modules/auth/auth.routes";
import { categoryRoutes } from "./modules/category/category.routes";
import { gearRoutes } from "./modules/gear/gear.routes";
import { rentalRoutes } from "./modules/rental/rental.routes";
import { userRoutes } from "./modules/user/user.routes";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "home page!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/gear", gearRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rentals", rentalRoutes);

export default app;
