import { prisma } from "../config/db.js";

// UTILITY
function getDayStart(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function calculateHours(start, end) {
  return (new Date(end) - new Date(start)) / (1000 * 60 * 60);
}

// Shared helper
const updateDailyAttendance = async (
  employeeId,
  timestamp,
  punchType,
  source
) => {
  const date = getDayStart(timestamp);

  let daily = await prisma.dailyAttendance.findFirst({
    where: {
      employeeId,
      date,
    },
  });

  const isEarlier = (a, b) => a && new Date(a) > new Date(b);
  const isLater = (a, b) => a && new Date(a) < new Date(b);

  if (!daily) {
    daily = await prisma.dailyAttendance.create({
      data: {
        employeeId,
        date,
        checkIn: punchType === "IN" ? timestamp : null,
        checkOut: punchType === "OUT" ? timestamp : null,
        source,
        status: "PRESENT",
      },
    });
  } else {
    daily = await prisma.dailyAttendance.update({
      where: { id: daily.id },
      data: {
        checkIn:
          punchType === "IN" &&
          (!daily.checkIn || isEarlier(daily.checkIn, timestamp))
            ? timestamp
            : daily.checkIn,
        checkOut:
          punchType === "OUT" &&
          (!daily.checkOut || isLater(daily.checkOut, timestamp))
            ? timestamp
            : daily.checkOut,
        source,
      },
    });
  }

  // Recalculate
  if (daily.checkIn && daily.checkOut) {
    const hours = calculateHours(daily.checkIn, daily.checkOut);
    const status = hours >= 9 ? "PRESENT" : hours >= 4 ? "HALF_DAY" : "ABSENT";
    const ot = hours > 9 ? hours - 9 : 0;

    await prisma.dailyAttendance.update({
      where: { id: daily.id },
      data: {
        totalHours: hours,
        otHours: ot,
        status,
      },
    });
  }

  return daily;
};

// 1. Biometric Push
export const pushBiometricAttendanceService = async (data) => {
  const { employeeId, timestamp, punchType, deviceId } = data;

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employee) throw new Error("Employee not found");

  const log = await prisma.attendanceLog.create({
    data: {
      employeeId,
      timestamp: new Date(timestamp),
      punchType,
      deviceId,
      source: "BIOMETRIC",
    },
  });

  const summary = await updateDailyAttendance(
    employeeId,
    new Date(timestamp),
    punchType,
    "BIOMETRIC"
  );

  return { log, summary };
};

// 2. Manual Attendance Entry
export const manualAttendanceEntryService = async (data) => {
  try {
    const { employeeId, checkIn, checkOut } = data;

    console.log(data, "📥 Received Manual Attendance Data");

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) throw new Error("Employee not found");

    const punchLogs = [];

    // Create punch IN log
    if (checkIn) {
      punchLogs.push(
        await prisma.attendanceLog.create({
          data: {
            employeeId,
            timestamp: new Date(checkIn),
            punchType: "IN",
            source: "MANUAL",
          },
        })
      );
    }

    // Create punch OUT log
    if (checkOut) {
      punchLogs.push(
        await prisma.attendanceLog.create({
          data: {
            employeeId,
            timestamp: new Date(checkOut),
            punchType: "OUT",
            source: "MANUAL",
          },
        })
      );
    }

    // Compute daily summary
    const workDate = getDayStart(checkIn || checkOut);
    const total = checkIn && checkOut ? calculateHours(checkIn, checkOut) : 0;

    const summary = await prisma.dailyAttendance.upsert({
      where: {
        employee_date_unique: {
          employeeId,
          date: workDate,
        },
      },
      create: {
        employeeId,
        date: workDate,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        source: "MANUAL",
        totalHours: total,
        otHours: total > 9 ? total - 9 : 0,
        status: total >= 9 ? "PRESENT" : total >= 4 ? "HALF_DAY" : "ABSENT",
      },
      update: {
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        source: "MANUAL",
      },
    });

    return { summary, logs: punchLogs };
  } catch (error) {
    console.log(error, "this is the error");
    throw new Error(error);
  }
};

// Get all attendance logs (optionally filterable)
export const getAllAttendanceLogsService = async () => {

  const logs = await prisma.attendanceLog.findMany({
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          email: true,
          employeeCode: true,
          department: { select: { name: true } },
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  return { logs };
};


// services/attendance.service.js

export const getAllDailyAttendanceService = async () => {

  const dailyAttendance = await prisma.dailyAttendance.findMany({
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          email: true,
          employeeCode: true,
          department: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return { dailyAttendance };
};


// Get punch logs for an employee
export const getAttendanceLogsByEmployeeIdService = async (employeeId) => {

  const logs = await prisma.attendanceLog.findMany({
    where: { employeeId },
    orderBy: { timestamp: "asc" },
  });

  return { logs };
};

// Get daily summaries for an employee
export const getDailyAttendanceByEmployeeIdService = async (employeeId) => {
  
  const summaries = await prisma.dailyAttendance.findMany({
    where: { employeeId },
    orderBy: { date: "desc" },
  });

  return { summaries };
};


// GET /attendance/daily/id/:id
export const getDailyAttendanceByIdService = async (req, res) => {
  try {
    const { id } = req.params;

    const daily = await prisma.dailyAttendance.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            employeeCode: true,
            department: { select: { name: true } },
          },
        },
      },
    });

    if (!daily) return res.status(404).json({ message: "Not found" });

    res.json({ daily });
  } catch (error) {
    res.status(500).json({ message: "Error fetching daily attendance" });
  }
};
