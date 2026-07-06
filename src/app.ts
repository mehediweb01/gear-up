import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import config from "./config";
import { adminRoutes } from "./modules/admin/admin.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { providerRoutes } from "./modules/provider/provider.routes";

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
app.use("/api/provider", providerRoutes);
app.use("/api/admin", adminRoutes);

export default app;
