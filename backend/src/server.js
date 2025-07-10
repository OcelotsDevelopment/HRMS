import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import sanitizedConfig from "./config.js";

import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import departmentRouter from "./routes/departmentRouter.js";
import adminRouter from "./routes/adminRouter.js";
import employeeRouter from "./routes/employeeRouter.js";
import settingRouter from "./routes/settingRouter.js";
import workforceRouter from "./routes/workforceRouter.js";
import attendanceRouter from "./routes/attendanceRoute.js";
import dashBoardRouter from "./routes/dashboardRoutes.js";

import { errorHandler, notFound } from "./middlewares/errorMiddlware.js";
import { pushBiometricAttendance } from "./controller/attendanceController.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
// Use raw parser for cdata
app.use("/iclock/cdata.aspx", express.raw({ type: "*/*" }));

app.use((req, res, next) => {
  console.log(`--> [${req.method}] ${req.url}`);
  next();
});
app.use("/api/auth/", authRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/department", departmentRouter);
app.use("/api/department", departmentRouter);
app.use("/api/setting", settingRouter);
app.use("/api/workforce", workforceRouter);
app.use("/api/attendance/", attendanceRouter);
app.use("/api/dashboard/", dashBoardRouter);

// app.all("/iclock/*", (req, res) => {
//   console.log("📥 Received something at /iclock/*", req.method, req.url);
//   res.send("OK");
// });

app.post("/iclock/cdata.aspx", express.raw({ type: "*/*" }), async (req, res) => {
  const raw = req.body?.toString();

  if (!raw) return res.send("OK");

  const rows = raw.trim().split("\n");

  console.log(rows, "Raw biometric logs");

  for (const row of rows) {
    const fields = row.trim().split("\t");

    if (fields.length < 2) {
      console.log(" Skipping invalid row:", row);
      continue;
    }

    const [userId, time, verifyMode = "0"] = fields;

    const body = {
      UserID: userId,
      Time: time,
      sn: req.query.SN ?? "UNKNOWN_SN",
      VerifyMode: verifyMode,
    };

    console.log(body, " Parsed punch");

    try {
      await pushBiometricAttendance(
        { body },
        {
          status: () => ({ json: () => {} }), // dummy response
        }
      );
    } catch (err) {
      console.log(" Push failed:", err.message);
    }
  }

  res.send("OK");
});

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.use(notFound);
app.use(errorHandler);

const PORT = sanitizedConfig.PORT || 8000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}
===============
||           ||
||           ||
||           ||
===============
||         ||
||          ||
||           ||
||            ||`)
);
