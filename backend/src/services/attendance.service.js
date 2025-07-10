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
  source,
  userId
) => {
  const date = getDayStart(timestamp);

  // Try to find existing daily record
  let daily = await prisma.dailyAttendance.findFirst({
    where: {
      OR: [
        employeeId ? { employeeId } : undefined,
        userId ? { userId } : undefined,
      ].filter(Boolean),
      date,
    },
  });

  const isEarlier = (a, b) => a && new Date(a) > new Date(b);
  const isLater = (a, b) => a && new Date(a) < new Date(b);

  if (!daily) {
    // Create daily record
    daily = await prisma.dailyAttendance.create({
      data: {
        employeeId,
        userId,
        date,
        checkIn: punchType === "IN" ? timestamp : null,
        checkOut: punchType === "OUT" ? timestamp : null,
        source,
        status: "PRESENT",
      },
    });
  } else {
    // Update existing record
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

  // Recalculate total/OT hours and update status
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

export const pushBiometricAttendanceService = async (data) => {
  const { UserID, Time, sn, VerifyMode } = data;
  const timestamp = new Date(Time);

  // Round to nearest second (some biometric devices are millisecond accurate)
  const roundedTimestamp = new Date(Math.floor(timestamp.getTime() / 1000) * 1000);

  const employee = await prisma.employee.findFirst({
    where: { employeeUniqueId: String(UserID) },
  });

  const user = !employee
    ? await prisma.user.findFirst({
        where: { userUniqueId: String(UserID) },
      })
    : null;

  if (!employee && !user) {
    throw new Error(`No employee or user found for UserID ${UserID}`);
  }

  const employeeId = employee?.id ?? null;
  const userId = user?.id ?? null;

  // Check if a log at exact time already exists (ignore duplicate punches)
  const existingLog = await prisma.attendanceLog.findFirst({
    where: {
      timestamp: roundedTimestamp,
      ...(employeeId && { employeeId }),
      ...(userId && { userId }),
    },
  });

  if (existingLog) {
    return { log: existingLog, message: "Duplicate punch ignored" };
  }

  // Determine IN/OUT
  const startOfDay = new Date(roundedTimestamp);
  startOfDay.setHours(0, 0, 0, 0);

  const latestLog = await prisma.attendanceLog.findFirst({
  where: {
    ...(employeeId ? { employeeId } : {}),
    ...(userId ? { userId } : {}),
    timestamp: {
      lt: roundedTimestamp, // Only logs before current punch
    },
  },
  orderBy: {
    timestamp: "desc",
  },
});

const punchType = latestLog?.punchType === "IN" ? "OUT" : "IN";

  const log = await prisma.attendanceLog.create({
    data: {
      employeeId,
      userId,
      timestamp: roundedTimestamp,
      punchType,
      deviceId: sn,
      verifyMode: VerifyMode ? parseInt(VerifyMode) : null,
      source: "BIOMETRIC",
    },
  });

  const summary = await updateDailyAttendance(
    employeeId,
    roundedTimestamp,
    punchType,
    "BIOMETRIC",
    userId
  );

  return { log, summary };
};


// 2. Manual Attendance Entry
export const manualAttendanceEntryService = async (data) => {
  try {
    const { employeeId, userId, checkIn, checkOut } = data;

    let employee = null;
    let user = null;

    // 1. Lookup employee by employeeId or employeeUniqueId
    if (employeeId) {
      employee = await prisma.employee.findFirst({
        where: {
          OR: [
            { id: typeof employeeId === "number" ? employeeId : undefined },
            {
              employeeUniqueId:
                typeof employeeId === "string" ? employeeId : undefined,
            },
          ],
        },
      });
    }

    // 2. Lookup user if employee not found and userId is provided
    if (!employee && userId) {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: typeof userId === "number" ? userId : undefined },
            { userUniqueId: typeof userId === "string" ? userId : undefined },
          ],
        },
      });
    }

    if (!employee && !user) {
      throw new Error("No employee or user found for attendance entry");
    }

    const finalEmployeeId = employee?.id ?? null;
    const finalUserId = user?.id ?? null;

    const getDayStart = (datetime) => {
      const date = new Date(datetime);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const workDate = getDayStart(checkIn || checkOut);
    const dayStart = new Date(workDate);
    const dayEnd = new Date(workDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existingLogs = await prisma.attendanceLog.findMany({
      where: {
        OR: [
          finalEmployeeId ? { employeeId: finalEmployeeId } : undefined,
          finalUserId ? { userId: finalUserId } : undefined,
        ].filter(Boolean),
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
        "This person already has check-in and check-out entries for the day"
      );
    }

    const punchLogs = [];

    if (checkIn && !hasCheckIn) {
      punchLogs.push(
        await prisma.attendanceLog.create({
          data: {
            employeeId: finalEmployeeId,
            userId: finalUserId,
            timestamp: new Date(checkIn),
            punchType: "IN",
            source: "MANUAL",
          },
        })
      );
    }

    if (checkOut && !hasCheckOut) {
      punchLogs.push(
        await prisma.attendanceLog.create({
          data: {
            employeeId: finalEmployeeId,
            userId: finalUserId,
            timestamp: new Date(checkOut),
            punchType: "OUT",
            source: "MANUAL",
          },
        })
      );
    }

    const total = checkIn && checkOut ? calculateHours(checkIn, checkOut) : 0;

    let summary = null;
    if (finalEmployeeId) {
      summary = await prisma.dailyAttendance.upsert({
        where: {
          employee_date_unique: {
            employeeId: finalEmployeeId,
            date: workDate,
          },
        },
        create: {
          employeeId: finalEmployeeId,
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
    }

    return { summary, logs: punchLogs };
  } catch (error) {
    console.error(error, " Error in manualAttendanceEntryService");
    throw new Error(error.message || "Manual attendance entry failed");
  }
};

export const updateManualAttendanceEntryService = async (id, data) => {
  try {
    const { employeeId, userId, checkIn, checkOut } = data;

    console.log(data, "📤 Updating Manual Attendance Data");

    // 1. Lookup employee or user
    let employee = null;
    let user = null;

    if (employeeId) {
      employee = await prisma.employee.findFirst({
        where: {
          OR: [
            { id: typeof employeeId === "number" ? employeeId : undefined },
            {
              employeeUniqueId:
                typeof employeeId === "string" ? employeeId : undefined,
            },
          ],
        },
      });
    }

    if (!employee && userId) {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: typeof userId === "number" ? userId : undefined },
            { userUniqueId: typeof userId === "string" ? userId : undefined },
          ],
        },
      });
    }

    if (!employee && !user) {
      throw new Error("No matching employee or user found");
    }

    const finalEmployeeId = employee?.id ?? null;
    const finalUserId = user?.id ?? null;

    // 2. Get start of day for attendance
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

    // 3. Update existing Check-IN
    const checkInLog = await prisma.attendanceLog.findFirst({
      where: {
        OR: [
          finalEmployeeId ? { employeeId: finalEmployeeId } : undefined,
          finalUserId ? { userId: finalUserId } : undefined,
        ].filter(Boolean),
        punchType: "IN",
        timestamp: {
          gte: dayStart,
          lte: dayEnd,
        },
        source: "MANUAL",
      },
    });

    if (checkInLog && checkIn) {
      punchLogs.push(
        await prisma.attendanceLog.update({
          where: { id: checkInLog.id },
          data: {
            timestamp: new Date(checkIn),
          },
        })
      );
    }

    // 4. Update existing Check-OUT
    const checkOutLog = await prisma.attendanceLog.findFirst({
      where: {
        OR: [
          finalEmployeeId ? { employeeId: finalEmployeeId } : undefined,
          finalUserId ? { userId: finalUserId } : undefined,
        ].filter(Boolean),
        punchType: "OUT",
        timestamp: {
          gte: dayStart,
          lte: dayEnd,
        },
        source: "MANUAL",
      },
    });

    if (checkOutLog && checkOut) {
      punchLogs.push(
        await prisma.attendanceLog.update({
          where: { id: checkOutLog.id },
          data: {
            timestamp: new Date(checkOut),
          },
        })
      );
    }

    if (!checkInLog && !checkOutLog) {
      throw new Error(
        "No manual IN or OUT logs found for this person on the specified date"
      );
    }

    // 5. Recalculate summary if employee
    const total = checkIn && checkOut ? calculateHours(checkIn, checkOut) : 0;
    let summary = null;

    if (finalEmployeeId) {
      summary = await prisma.dailyAttendance.upsert({
        where: {
          employee_date_unique: {
            employeeId: finalEmployeeId,
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
          employeeId: finalEmployeeId,
          date: workDate,
          checkIn: checkIn ? new Date(checkIn) : null,
          checkOut: checkOut ? new Date(checkOut) : null,
          totalHours: total,
          otHours: total > 9 ? total - 9 : 0,
          status: total >= 9 ? "PRESENT" : total >= 4 ? "HALF_DAY" : "ABSENT",
          source: "MANUAL",
        },
      });
    }

    return { summary, logs: punchLogs };
  } catch (error) {
    console.error(error, "❌ Error in updateManualAttendanceEntryService");
    throw new Error(error.message || "Failed to update manual attendance");
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
          employeeUniqueId: true,
          department: {
            select: {
              name: true,
            },
          },
        },
      },
      User: {
        select: {
          id: true,
          name: true,
          email: true,
          userUniqueId: true,
          role: true,
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
          employeeUniqueId: true,
          department: {
            select: { name: true },
          },
        },
      },
      User: {
        select: {
          id: true,
          name: true,
          email: true,
          userUniqueId: true,
          role: true,
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
  return summaries;
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
