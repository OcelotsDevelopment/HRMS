import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import sanitizedConfig from "./config.js";

import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import departmentRouter from "./routes/departmentRouter.js"
import adminRouter from "./routes/adminRouter.js"
import employeeRouter from "./routes/employeeRouter.js"
import settingRouter from "./routes/settingRouter.js"
import workforceRouter from "./routes/workforceRouter.js"


import { errorHandler, notFound } from "./middlewares/errorMiddlware.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth/", authRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/employee/", employeeRouter);
app.use("/api/department", departmentRouter);
app.use("/api/department", departmentRouter);
app.use("/api/setting", settingRouter);
app.use("/api/workforce", workforceRouter);



app.get("/", (req, res) => {
  res.send("API is running!");
});

app.use(notFound);
app.use(errorHandler);

const PORT = sanitizedConfig.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));