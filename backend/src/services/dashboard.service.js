import { prisma } from "../config/db.js";

export const getDashboardOverviewService = async () => {
  const [
    totalEmployees,
    totalDepartments,
    todayAttendanceCount,
    yesterdayAttendanceCount,
  ] = await Promise.all([
    prisma.employee.count(),
    prisma.department.count(),
    prisma.dailyAttendance.count({
      where: {
        date: {
          equals: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        status: { in: ["PRESENT", "HALF_DAY"] },
      },
    }),
    prisma.dailyAttendance.count({
      where: {
        date: {
          equals: new Date(
            new Date(Date.now() - 86400000).setHours(0, 0, 0, 0)
          ),
        },
        status: { in: ["PRESENT", "HALF_DAY"] },
      },
    }),
  ]);

  const [previousEmployeeCount, previousDepartmentCount] = await Promise.all([
    prisma.employee.count({
      where: {
        createdAt: {
          lt: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.department.count({
      where: {
        createdAt: {
          lt: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const birthdaysToday = await prisma.$queryRaw`
    SELECT id, name, dob, email
    FROM "Employee"
    WHERE EXTRACT(MONTH FROM "dob") = ${month}
      AND EXTRACT(DAY FROM "dob") = ${day}
  `;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const holidaysToday = await prisma.holiday.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    select: {
      id: true,
      title: true,
      date: true,
      region: true,
    },
  });

  const upcomingEvents = await prisma.event.findMany({
    where: {
      startDate: {
        gte: new Date(),
      },
    },
    orderBy: { startDate: "asc" },
    take: 3,
  });

  const demographics = await prisma.employee.groupBy({
    by: ["nationality"],
    _count: {
      nationality: true,
    },
    orderBy: {
      _count: {
        nationality: "desc",
      },
    },
  });

  const formattedDemographics = demographics.map((d) => ({
    nationality: d.nationality,
    count: d._count.nationality,
  }));

  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const changes = {
    employeeChange: calculateChange(totalEmployees, previousEmployeeCount),
    departmentChange: calculateChange(totalDepartments, previousDepartmentCount),
    attendanceChange: calculateChange(todayAttendanceCount, yesterdayAttendanceCount),
  };

  return {
    overview: {
      totalEmployees,
      totalDepartments,
      todayAttendanceCount,
      changes,
    },
    demographics: formattedDemographics,
    upcomingEvents,
    birthdaysToday,
    holidaysToday,
  };
};
