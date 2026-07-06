import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import config from "./config";
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

app.use("/api/users", userRoutes);

export default app;
