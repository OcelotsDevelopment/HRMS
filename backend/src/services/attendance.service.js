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
  const { UserID, Time, sn } = data;

  // 1. Map biometric UserID to employeeId
  const employee = await prisma.employee.findFirst({
    where: { employeeUniqueId: String(UserID) }, // Assuming you've stored this mapping
  });

  if (!employee) throw new Error(`No employee found for UserID ${UserID}`);

  const employeeId = employee.id;
  const timestamp = new Date(Time);

  // 2. Find latest log for the day
  const startOfDay = new Date(timestamp);
  startOfDay.setHours(0, 0, 0, 0);

  const latestLog = await prisma.attendanceLog.findFirst({
    where: {
      employeeId,
      timestamp: {
        gte: startOfDay,
        lte: timestamp,
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  // 3. Determine punchType
  const punchType = latestLog?.punchType === "IN" ? "OUT" : "IN";

  // 4. Save attendance log
  const log = await prisma.attendanceLog.create({
    data: {
      employeeId,
      timestamp,
      punchType,
      deviceId: sn,
      source: "BIOMETRIC",
    },
  });

  // 5. Update daily attendance summary
  const summary = await updateDailyAttendance(
    employeeId,
    timestamp,
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

    const getDayStart = (datetime) => {
      const date = new Date(datetime);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const workDate = getDayStart(checkIn || checkOut);
    const dayStart = new Date(workDate);
    const dayEnd = new Date(workDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Check if both IN and OUT already exist for the day
    const existingLogs = await prisma.attendanceLog.findMany({
      where: {
        employeeId,
        timestamp: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    const hasCheckIn = existingLogs.some((log) => log.punchType === "IN");
    const hasCheckOut = existingLogs.some((log) => log.punchType === "OUT");

    if (hasCheckIn && hasCheckOut) {
      throw new Error(
        "This employee already has check-in and check-out entries for the day"
      );
    }

    const punchLogs = [];

    // Create punch IN log if not exists
    if (checkIn && !hasCheckIn) {
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

    // Create punch OUT log if not exists
    if (checkOut && !hasCheckOut) {
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

    // Calculate total hours
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
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        source: "MANUAL",
        totalHours: total,
        otHours: total > 9 ? total - 9 : 0,
        status: total >= 9 ? "PRESENT" : total >= 4 ? "HALF_DAY" : "ABSENT",
      },
    });

    return { summary, logs: punchLogs };
  } catch (error) {
    console.error(error, " Error in manualAttendanceEntryService");
    throw new Error(error.message || "Manual attendance entry failed");
  }
};

export const updateManualAttendanceEntryService = async (id, data) => {
  try {
    const { employeeId, checkIn, checkOut } = data;

    console.log(data, "📤 Updating Manual Attendance Data");

    // 1. Validate employee
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!employee) throw new Error("Employee not found");

    // 2. Define work day range
    const getDayStart = (datetime) => {
      const date = new Date(datetime);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const workDate = getDayStart(checkIn || checkOut);
    const dayStart = new Date(workDate);
    const dayEnd = new Date(workDate);
    dayEnd.setHours(23, 59, 59, 999);

    const punchLogs = [];

    // 3. Update existing check-in log if exists
    const checkInLog = await prisma.attendanceLog.findFirst({
      where: {
        employeeId,
        punchType: "IN",
        timestamp: {
          gte: dayStart,
          lte: dayEnd,
        },
        source: "MANUAL",
      },
    });

    if (checkInLog && checkIn) {
      const updated = await prisma.attendanceLog.update({
        where: { id: checkInLog.id },
        data: {
          timestamp: new Date(checkIn),
        },
      });
      punchLogs.push(updated);
    }

    // 4. Update existing check-out log if exists
    const checkOutLog = await prisma.attendanceLog.findFirst({
      where: {
        employeeId,
        punchType: "OUT",
        timestamp: {
          gte: dayStart,
          lte: dayEnd,
        },
        source: "MANUAL",
      },
    });

    if (checkOutLog && checkOut) {
      const updated = await prisma.attendanceLog.update({
        where: { id: checkOutLog.id },
        data: {
          timestamp: new Date(checkOut),
        },
      });
      punchLogs.push(updated);
    }

    // 5. If neither IN nor OUT logs found, throw
    if (!checkInLog && !checkOutLog) {
      throw new Error(
        "No manual IN or OUT logs found for this employee on the specified date"
      );
    }

    // 6. Recalculate daily summary
    const total =
      checkIn && checkOut ? calculateHours(checkIn, checkOut) : 0;

    const summary = await prisma.dailyAttendance.upsert({
      where: {
        employee_date_unique: {
          employeeId,
          date: workDate,
        },
      },
      update: {
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        totalHours: total,
        otHours: total > 9 ? total - 9 : 0,
        status: total >= 9 ? "PRESENT" : total >= 4 ? "HALF_DAY" : "ABSENT",
        source: "MANUAL",
      },
      create: {
        // create only if summary doesn't exist yet
        employeeId,
        date: workDate,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        totalHours: total,
        otHours: total > 9 ? total - 9 : 0,
        status: total >= 9 ? "PRESENT" : total >= 4 ? "HALF_DAY" : "ABSENT",
        source: "MANUAL",
      },
    });

    return { summary, logs: punchLogs };
  } catch (error) {
    console.error(error, "Error in updateManualAttendanceEntryService");
    throw new Error(error.message || "Update attendance entry failed");
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
export const getAttendanceLogsByEmployeeIdService = async (logId) => {
  try {
    const attendanceLog = await prisma.attendanceLog.findUnique({
      where: { id: logId },
      include: {
        employee: true,
      },
    });

    if (!attendanceLog) throw new Error("Attendance log not found");

    const date = new Date(attendanceLog.timestamp);
    date.setHours(0, 0, 0, 0);

    const dailyAttendance = await prisma.dailyAttendance.findUnique({
      where: {
        employee_date_unique: {
          employeeId: attendanceLog.employeeId,
          date,
        },
      },
      select: {
        id: true,
        employeeId: true,
        checkIn: true,
        checkOut: true,
        totalHours: true,
        otHours: true,
      },
    });

    return {
      ...attendanceLog,
      dailyAttendance,
    };
  } catch (error) {
    console.error(error, " Error fetching attendance log and summary");
    throw new Error(error.message || "Failed to fetch attendance log");
  }
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
