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
    leaveDate,
    isPaid,
    employeeId,
    appliedByEmployeeId,
    appliedByUserId,
  } = data;

  if (!title?.trim()) throw new Error("Title is required");
  if (!leaveDate || isNaN(new Date(leaveDate)))
    throw new Error("Valid leave date is required");
  if (!employeeId) throw new Error("Employee ID is required");

  const leave = await prisma.leave.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      leaveDate: new Date(leaveDate),
      isPaid: isPaid ?? true,
      employeeId: Number(employeeId),
      appliedByEmployeeId: appliedByEmployeeId
        ? Number(appliedByEmployeeId)
        : null,
      appliedByUserId: appliedByUserId ? Number(appliedByUserId) : null,
    },
  });

  return { leave };
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
      orderBy: { leaveDate: "desc" },
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

//  Update Leave
export const updateLeaveService = async (id, data) => {
  const leave = await prisma.leave.findUnique({ where: { id } });
  if (!leave) throw new Error("Leave not found");

  const updated = await prisma.leave.update({
    where: { id },
    data: {
      ...data,
      leaveDate: data.leaveDate ? new Date(data.leaveDate) : undefined,
      status: data.status?.toUpperCase(), // <-- convert status to uppercase if present
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

  console.log(data,"daatatatatatatataatatatatatatata");
  
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
