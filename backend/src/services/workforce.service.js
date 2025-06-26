import { prisma } from "../config/db.js";
// Holiday

export const createHolidayService = async (data) => {
  const { title, description, date, isPaid, holidayTypeId, regionId } = data;

  if (!title?.trim()) throw new Error("Title is required");

  const parsedDate = new Date(date);
  if (!date || isNaN(parsedDate.getTime()))
    throw new Error("Valid date is required");

  const holiday = await prisma.holiday.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      date: parsedDate,
      isPaid: isPaid ?? true,
      holidayTypeId: Number(holidayTypeId),
      regionId: regionId ? Number(regionId) : null,
    },
  });

  return { holiday };
};

export const getAllHolidaysService = async () => {
  const holidays = await prisma.holiday.findMany({
    include: {
      holidayType: true,
      region: true,
    },
    orderBy: { date: "asc" },
  });

  return { holidays };
};

export const getHolidayByIdService = async (id) => {
  const holiday = await prisma.holiday.findUnique({
    where: { id },
    include: { holidayType: true, region: true },
  });

  if (!holiday) throw new Error("Holiday not found");
  return { holiday };
};

export const updateHolidayService = async (id, data) => {
  const holiday = await prisma.holiday.findUnique({ where: { id } });
  if (!holiday) throw new Error("Holiday not found");

  const updated = await prisma.holiday.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
  });

  return { holiday: updated };
};

export const deleteHolidayService = async (id) => {
  await prisma.holiday.delete({ where: { id } });
  return { message: "Holiday deleted successfully" };
};

// Leave
// backend/services

//  Create Leave
export const createLeaveService = async (data) => {
  const {
    title,
    description,
    from,
    to,
    type,
    isPaid,
    employeeId,
    appliedByEmployeeId,
    appliedByUserId,
  } = data;

  const leave = await prisma.leave.create({
    data: {
      title,
      description,
      from,
      to,
      type,
      isPaid,
      employeeId,
      appliedByEmployeeId,
      appliedByUserId,
    },
  });

  return leave;
};

//  Get All Leaves
export const getAllLeavesService = async () => {
  try {
    const leaves = await prisma.leave.findMany({
      include: {
        employee: true,
        appliedByEmployee: true,
        appliedByUser: true,
      },
      orderBy: { from: "desc" }, // ✅ use 'from' instead of 'leaveDate'
    });

    return leaves;
  } catch (error) {
    console.error("Get All Leaves Error:", error);
    throw new Error("Failed to fetch leave records");
  }
};

//  Get Leave By ID
export const getLeaveByIdService = async (id) => {
  const leave = await prisma.leave.findUnique({
    where: { id },
    include: {
      employee: true,
      appliedByEmployee: true,
      appliedByUser: true,
    },
  });

  if (!leave) throw new Error("Leave not found");
  return leave;
};

// services/leave.service.ts
export const getLeavesByEmployeeId = async (employeeId) => {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: {
      id: true,
      name: true,
      employeeUniqueId: true,
      dateOfJoining: true,
    },
  });

  if (!employee) throw new Error("Employee not found");

  const leaves = await prisma.leave.findMany({
    where: { employeeId },
    orderBy: { createdAt: "desc" },
  });

  const today = new Date();
  const joinDate = new Date(employee.dateOfJoining);

  // Total months from join date to current date
  const monthsWorked =
    (today.getFullYear() - joinDate.getFullYear()) * 12 +
    (today.getMonth() - joinDate.getMonth()) + 1;

    console.log(monthsWorked,"monthsWorkedmonthsWorkedmonthsWorkedmonthsWorkedmonthsWorked");
    

  const totalAccrued = monthsWorked * 1.5;

  // Calculate total used leaves across all months
  const totalUsed = leaves.reduce((acc, leave) => {
    const from = new Date(leave.from);
    const to = new Date(leave.to);
    const days = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1;
    return acc + days;
  }, 0);
  
  const remaining = totalAccrued - totalUsed;
  console.log(remaining,"remainingremainingremainingremainingremaining");

  // Leaves used this current month
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const usedThisMonth = leaves.reduce((acc, leave) => {
    const from = new Date(leave.from);
    const to = new Date(leave.to);

    if (
      from.getMonth() === currentMonth &&
      from.getFullYear() === currentYear
    ) {
      const days = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1;
      return acc + days;
    }

    return acc;
  }, 0);

  const availableThisMonth = 1.5; // per policy
  const remainingThisMonth = Math.max(availableThisMonth - usedThisMonth, 0);

  return {
    leaves,
    leaveBalance: {
      totalAccrued: parseFloat(totalAccrued.toFixed(1)),
      totalUsed: parseFloat(totalUsed.toFixed(1)),
      remaining: parseFloat(Math.max(remaining, 0).toFixed(1)),

      usedThisMonth: parseFloat(usedThisMonth.toFixed(1)),
      availableThisMonth: parseFloat(availableThisMonth.toFixed(1)),
      remainingThisMonth: parseFloat(remaining.toFixed(1)),
    },
  };
};


export const updateLeaveService = async (id, data) => {
  const leave = await prisma.leave.findUnique({ where: { id } });
  if (!leave) throw new Error("Leave not found");
  const updated = await prisma.leave.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      from: data.from ? new Date(data.from) : undefined,
      to: data.to ? new Date(data.to) : undefined,
      type: data.type,
      isPaid: typeof data.isPaid === "boolean" ? data.isPaid : undefined,
      employeeId: data.employeeId,
      status: data.status?.toUpperCase(), // "PENDING", "APPROVED", etc.
    },
  });

  return { leave: updated };
};

//  Delete Leave
export const deleteLeaveService = async (id) => {
  await prisma.leave.delete({ where: { id } });
  return { message: "Leave deleted successfully" };
};

// Events

// Create Event
export const createEventService = async (data) => {
  const { title, description, startDate, endDate, calendar, regionId } = data;

  if (!title?.trim()) throw new Error("Event title is required");
  if (!startDate || !endDate)
    throw new Error("Start and end dates are required");
  if (!calendar?.trim()) throw new Error("Event type (calendar) is required");

  const event = await prisma.event.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      type: calendar,
      regionId: regionId ? Number(regionId) : null,
    },
  });

  return { event };
};

// Get All Events
export const getAllEventsService = async () => {
  const events = await prisma.event.findMany({
    include: {
      region: true,
    },
    orderBy: { startDate: "asc" },
  });

  return { events };
};

// Get Event by ID
export const getEventByIdService = async (id) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      region: true,
    },
  });

  if (!event) throw new Error("Event not found");
  return { event };
};

// Update Event
export const updateEventService = async (id, data) => {
  console.log(data, "daatatatatatatataatatatatatatata");

  const { title, description, startDate, endDate, calendar, regionId } = data;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new Error("Event not found");

  if (!title?.trim()) throw new Error("Event title is required");
  if (!startDate || !endDate)
    throw new Error("Start and end dates are required");
  if (!calendar?.trim()) throw new Error("Event type (calendar) is required");

  const updatedEvent = await prisma.event.update({
    where: { id },
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      type: calendar,
      regionId: regionId ? Number(regionId) : null,
    },
  });

  return { event: updatedEvent };
};

// Delete Event
export const deleteEventService = async (id) => {
  await prisma.event.delete({ where: { id } });
  return { message: "Event deleted successfully" };
};
