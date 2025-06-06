import { prisma } from "../config/db.js";

export const addDepartmentService = async ({ name, headId }) => {
  // try {
  const departmentFind = await prisma.department.findUnique({
    where: { name },
  });

  if (departmentFind) {
    throw new Error("Department Already Exists");
  }

  const department = await prisma.department.create({
    data: {
      name,
      ...(headId && { headId }),
    },
  });

  return { department };
  // } catch (error) {
  //   console.error("Error creating department:", error);
  //   throw new Error("Failed to create department");
  // }
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
  console.log(id, name, headId, "jsdfkjsdhfkjsdhfkjsdfhdkjh");

  try {
    const data = {
      name,
      ...(headId
        ? {
            head: {
              connect: { id: headId },
            },
          }
        : {
            head: {
              disconnect: true, 
            },
          }),
    };
    const department = await prisma.department.update({
      where: { id },
      data,
    });

    return { department };
  } catch (error) {
    throw new Error(error.message || "Failed to update department");
  }
};
