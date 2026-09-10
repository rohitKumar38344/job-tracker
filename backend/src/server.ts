import "dotenv/config";
import express, { Request, Response } from "express";
import { pool } from "./db";
import companyRouter from "./modules/companies/company.routes";
import jobRouter from "./modules/jobs/job.routes";
import authRouter from "./modules/auth/auth.routes";
import applicationRouter from "./modules/applications/application.routes";
import interviewRouter from "./modules/interviews/interview.routes";
import dashboardRouter from "./modules/dashboard/dashboard.routes";
import { errorHandler } from "./middlewares/error-handler";
import { env } from "./config/env";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);
app.use(express.json({limit: '10kb'}));

app.get("/health", async (req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/companies", companyRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);
app.use("/api", interviewRouter);
app.use("/api/dashboard", dashboardRouter);

app.use(errorHandler);
app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
