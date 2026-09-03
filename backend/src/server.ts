import "dotenv/config"
import express, { Request, Response } from "express";
import { pool } from "./db";
import companyRouter from "./modules/companies/company.routes"
import { errorHandler } from "./middlewares/error-handler";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())

app.get('/health', async(req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1')
    res.status(200).json({
      status: "ok",
      database: 'connected'
    })
  } catch (error) {
    console.error('Database connection failed:', error)
    res.status(500).json({
      status: "error",
      database: "disconnected"
    })
  }
})

app.use('/api/companies', companyRouter)
app.use(errorHandler)
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
