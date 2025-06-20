import { prisma } from "../config/db.js";

// ✅ Create Region
export const createRegionService = async (data) => {
  try {
    const { name, description } = data;

    if (!name || !name.trim()) throw new Error("Region name is required");

    const existing = await prisma.region.findUnique({
      where: { name },
    });

    if (existing) throw new Error("Region with this name already exists");

    const region = await prisma.region.create({
      data: { name, description },
    });

    return { region };
  } catch (error) {
    console.error("Create Region Error:", error.message);
    throw new Error(error.message || "Failed to create region");
  }
};

// ✅ Get All Regions
export const getAllRegionsService = async () => {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { regions };
  } catch (error) {
    console.error("Get All Regions Error:", error.message);
    throw new Error("Failed to fetch regions");
  }
};

// ✅ Get Region by ID
export const getRegionByIdService = async (id) => {
  try {
    const region = await prisma.region.findUnique({ where: { id } });
    if (!region) throw new Error("Region not found");
    return { region };
  } catch (error) {
    console.error("Get Region Error:", error.message);
    throw new Error(error.message || "Failed to fetch region");
  }
};

// ✅ Update Region
export const updateRegionService = async (id, data) => {
  try {
    const region = await prisma.region.findUnique({ where: { id } });
    if (!region) throw new Error("Region not found");

    const updatedRegion = await prisma.region.update({
      where: { id },
      data,
    });

    return { region: updatedRegion };
  } catch (error) {
    console.error("Update Region Error:", error.message);
    throw new Error(error.message || "Failed to update region");
  }
};

// ✅ Delete Region
export const deleteRegionService = async (id) => {
  try {
    await prisma.region.delete({ where: { id } });
    return { message: "Region deleted successfully" };
  } catch (error) {
    console.error("Delete Region Error:", error.message);
    throw new Error(error.message || "Failed to delete region");
  }
};


// Holiday 

export const createHolidayTypeService = async (data) => {
  const { name } = data;
  if (!name?.trim()) throw new Error("Holiday type name is required");

  const existing = await prisma.holidayType.findUnique({ where: { name } });
  if (existing) throw new Error("Holiday type already exists");

  const holidayType = await prisma.holidayType.create({ data: { name } });
  return { holidayType };
};

export const getAllHolidayTypesService = async () => {
  const holidayTypes = await prisma.holidayType.findMany({
    orderBy: { createdAt: "desc" },
  });
  return { holidayTypes };
};

export const getHolidayTypeByIdService = async (id) => {
  const holidayType = await prisma.holidayType.findUnique({ where: { id } });
  if (!holidayType) throw new Error("Holiday type not found");
  return { holidayType };
};

export const updateHolidayTypeService = async (id, data) => {
  const holidayType = await prisma.holidayType.findUnique({ where: { id } });
  if (!holidayType) throw new Error("Holiday type not found");

  const updated = await prisma.holidayType.update({
    where: { id },
    data,
  });

  return { holidayType: updated };
};

export const deleteHolidayTypeService = async (id) => {
  await prisma.holidayType.delete({ where: { id } });
  return { message: "Holiday type deleted successfully" };
};
