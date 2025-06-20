import { prisma } from "../config/db.js";



// Holiday

export const createHolidayService = async (data) => {
  const { title, description, date, isPaid, holidayTypeId, regionId } = data;

  if (!title?.trim()) throw new Error("Title is required");
  if (!date || isNaN(new Date(date))) throw new Error("Valid date is required");

  const holiday = await prisma.holiday.create({
    data: {
      title,
      description,
      date: new Date(date),
      isPaid: isPaid ?? true,
      holidayTypeId,
      regionId,
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
