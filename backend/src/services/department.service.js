import { prisma } from "../config/db.js";

export const addDepartmentService = async ({ name }) => {
  try {
    const departmentFind = await prisma.department.findUnique({
      where: { name },
    });

    if (departmentFind) {
      throw new Error("Department Already Exist");
    }
    const department = await prisma.department.create({
      data: {
        name: name,
      },
    });

    return { department };
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllDepartmentsService = async () => {
    try {
      const departments = await prisma.department.findMany({
        include: {
          head: true,
          _count: {
            select: { employees: true },
          },
        },
      });
      return { departments };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch departments");
    }
  };

  
  export const getDepartmentByIdService = async (id) => {
    try {
      const department = await prisma.department.findUnique({
        where: { id },
        include: {
          head: true,
          employees: true,
        },
      });
  
      if (!department) {
        throw new Error("Department not found");
      }
  
      return { department };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch department");
    }
  };

  export const updateDepartmentService = async (id, { name, headId }) => {
    try {
      const department = await prisma.department.update({
        where: { id },
        data: {
          name,
          head: {
            connect: { id: headId },
          },
        },
      });
  
      return { department };
    } catch (error) {
      throw new Error(error.message || "Failed to update department");
    }
  };
  