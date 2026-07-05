import dotenv from "dotenv";
import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

dotenv.config();

const PORT = config.port;

const main = async () => {
  try {
    await prisma.$connect();
    console.log(`Database connection success`);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} `);
    });
  } catch (err: any) {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
