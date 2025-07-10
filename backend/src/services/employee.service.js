import { prisma } from "../config/db.js";
import { uploadToCloudflare } from "../utils/cloudflareUploader.js";
import {
  isBefore,
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfDay,
  startOfDay,
} from "date-fns";

function isValidDate(input) {
  const date = new Date(input);
  return (
    !isNaN(date.getTime()) &&
    date.getFullYear() > 1900 &&
    date.getFullYear() < 2100
  );
}

const generateUniqueEmployeeId = async () => {
  let uniqueId;
  let exists = true;

  while (exists) {
    uniqueId = Math.floor(100 + Math.random() * 900); // Random 3-digit number
    const employee = await prisma.employee.findUnique({
      where: { employeeUniqueId: String(uniqueId) },
    });
    if (!employee) exists = false;
  }

  return String(uniqueId);
};

export const createEmployeeService = async (data) => {
  try {
    let {
      // 1. Basic Info
      name,
      email,
      mobile,
      designation,
      sex,
      dob,
      age,
      placeOfBirth,
      height,
      weight,
      bloodGroup,
      nationality,
      maritalStatus,

      // 2. Address
      currentAddress,
      permanentAddress,

      // 3. Job Details
      departmentId,
      coordinatorId,
      employeeCode,
      dateOfJoining,
      position,
      salaryOnJoining,
      reportingTo,
      hiredBy,
      replacementOf,
      isRehire,

      // 4. Qualification Details
      qualifications = [],

      // 5. Employment History
      employments = [],

      // 6. References
      references = [],

      // 7. Legal & Health Info
      liabilitiesDetails,
      familyBackground,
      hasFamilyBusiness,
      familyBusinessDetails,
      isPhysicallyImpaired,
      impairmentDetails,
    } = data;

    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      throw new Error("Employee already exists");
    }

    // Optional validation
    const department = departmentId
      ? await prisma.department.findUnique({ where: { id: departmentId } })
      : null;

    const coordinator = coordinatorId
      ? await prisma.user.findUnique({ where: { id: coordinatorId } })
      : null;

    // Generate unique employeeUniqueId
    const employeeUniqueId = await generateUniqueEmployeeId();

    const employee = await prisma.employee.create({
      data: {
        employeeUniqueId,
        name,
        email,
        mobile,
        designation,
        sex,
        dob: dob && isValidDate(dob) ? new Date(dob) : null,
        age,
        placeOfBirth,
        height,
        weight,
        bloodGroup,
        nationality,
        maritalStatus,

        currentAddress,
        permanentAddress,

        departmentId: department ? department.id : null,
        coordinatorId: coordinator ? coordinator.id : null, // new line

        employeeCode,
        dateOfJoining:
          dateOfJoining && isValidDate(dateOfJoining)
            ? new Date(dateOfJoining)
            : null,
        position,
        salaryOnJoining,
        reportingTo,
        hiredBy,
        replacementOf,
        isRehire,

        liabilitiesDetails,
        familyBackground,
        hasFamilyBusiness,
        familyBusinessDetails,
        isPhysicallyImpaired,
        impairmentDetails,

        qualifications: {
          create: qualifications,
        },
        employments: {
          create: employments,
        },
        references: {
          create: references,
        },
      },
    });

    return { employee };
  } catch (error) {
    console.error("Error creating employee:", error);
    throw new Error(error.message || "Failed to create employee");
  }
};

export const getAllEmployeesService = async () => {
  const employees = await prisma.employee.findMany({
    include: {
      department: true,
      coordinator: true, // include coordinator (User)
      qualifications: true,
      employments: true,
      references: true,
    },
    orderBy: {
      createdAt: "desc", // descending = newest first
    },
  });

  return { employees };
};

export const getEmployeeByIdService = async (id) => {
  if (!id) throw new Error("Employee ID is required");

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      department: true,
      coordinator: true,
      qualifications: true,
      employments: true,
      references: true,
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  return { employee };
};

export const updateEmployeeService = async (id, data) => {
  try {
    console.log(data, "============================");

    // Convert and validate dates
    if (data.dob && !isValidDate(data.dob)) {
      throw new Error("Invalid date of birth");
    }
    if (data.dob) data.dob = new Date(data.dob);

    if (data.dateOfJoining && !isValidDate(data.dateOfJoining)) {
      throw new Error("Invalid date of joining");
    }
    if (data.dateOfJoining) data.dateOfJoining = new Date(data.dateOfJoining);

    // Validate coordinatorId
    if (data.coordinatorId) {
      const coordinatorExists = await prisma.user.findUnique({
        where: { id: data.coordinatorId },
      });
      if (!coordinatorExists) {
        throw new Error("Coordinator not found");
      }
    }

    // Validate departmentId
    if (data.departmentId) {
      const departmentExists = await prisma.department.findUnique({
        where: { id: data.departmentId },
      });
      if (!departmentExists) {
        throw new Error("Department not found");
      }
    }

    // Destructure and restructure relation fields
    const { departmentId, coordinatorId, baseSalary, ...rest } = data;

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        ...rest,
        department: departmentId
          ? { connect: { id: departmentId } }
          : undefined,
        coordinator: coordinatorId
          ? { connect: { id: coordinatorId } }
          : undefined,
        salaryOnJoining: baseSalary ? Number(baseSalary) : undefined,
      },
    });

    return { employee };
  } catch (error) {
    console.error("Update Error:", error);
    throw new Error(error.message || "Failed to update employee");
  }
};

// Add employment
export const addEmploymentService = async (data) => {
  console.log(data, "datadatadatadatadatadatadata");

  const employee = await prisma.employee.findUnique({
    where: { id: data?.employeeId },
  });
  if (!employee) throw new Error("Employee not found");

  const employment = await prisma.employment.create({
    data: {
      ...data,
      workedFrom: data.workedFrom ? new Date(data.workedFrom) : undefined,
      workedTill: data.workedTill ? new Date(data.workedTill) : undefined,
      employeeId: Number(data.employeeId),
     salaryOnJoining: data.baseSalary ? Number(data.baseSalary) : undefined,
    },
  });

  return { employment };
};

// List all employments for an employee
export const listEmploymentService = async (employeeId) => {
  const employments = await prisma.employment.findMany({
    where: { employeeId },
    orderBy: { workedFrom: "desc" },
  });
  return { employments };
};

// Get employment by ID
export const getEmploymentByIdService = async (id) => {
  const employment = await prisma.employment.findUnique({
    where: { id: Number(id) },
  });

  if (!employment) {
    throw new Error("Employment not found");
  }

  return { employment };
};

// Update employment
export const updateEmploymentService = async (id, data) => {
  if (isNaN(id)) {
    throw new Error("Employment ID must be a valid number");
  }

  const employment = await prisma.employment.update({
    where: { id: id },
    data: {
      employerName: data.employerName || "",
      positionHeld: data.positionHeld || "",
      location: data.location || "",
      workedFrom: data.workedFrom ? new Date(data.workedFrom) : null,
      workedTill: data.workedTill ? new Date(data.workedTill) : null,
      lastSalaryDrawn: data.lastSalaryDrawn ?? null,
      reasonForLeaving: data.reasonForLeaving || null,
      remarks: data.remarks || null,
    },
  });

  return { employment };
};

// Update Image
export const uploadEmployeeImageService = async (
  id,
  fileBuffer,
  originalName
) => {
  const employee = await prisma.employee.findUnique({
    where: { id: Number(id) },
  });
  if (!employee) throw new Error("Employee not found");

  const cloudflareResult = await uploadToCloudflare(fileBuffer, originalName);

  const imageUrl = cloudflareResult?.result?.variants?.[0];
  if (!imageUrl) throw new Error("Image upload failed");

  await prisma.employee.update({
    where: { id: Number(id) },
    data: {
      profileImageUrl: imageUrl,
    },
  });

  return imageUrl;
};

// Delete employment
export const deleteEmploymentService = async (id) => {
  await prisma.employment.delete({ where: { id } });
  return { message: "Employment deleted successfully" };
};

//            {// qualification}
// Add qualification
export const addQualificationService = async (data) => {
  const employee = await prisma.employee.findUnique({
    where: { id: data?.employeeId },
  });
  if (!employee) throw new Error("Employee not found");

  const findQual = await prisma.qualification.findUnique({
    where: { standard: data.standard },
  });

  if (findQual) throw new Error("This Qualification Already Exist");

  const qualification = await prisma.qualification.create({
    data: {
      employeeId: data.employeeId,
      standard: data.standard,
      fromYear: data.fromYear,
      toYear: data.toYear,
      percentage: data.percentage ?? null,
    },
  });

  return { qualification };
};

// List qualifications by employeeId
export const listQualificationService = async (employeeId) => {
  const qualifications = await prisma.qualification.findMany({
    where: { employeeId },
    orderBy: { fromYear: "desc" },
  });
  return { qualifications };
};

// Get qualification by ID
export const getQualificationByIdService = async (id) => {
  const qualification = await prisma.qualification.findUnique({
    where: { id },
  });
  if (!qualification) {
    throw new Error("Qualification not found");
  }
  return { qualification };
};

// Update qualification
export const updateQualificationService = async (id, data) => {
  const findQual = await prisma.qualification.findUnique({
    where: { standard: data.standard },
  });

  if (findQual) throw new Error("This Qualification Already Exist");

  const qualification = await prisma.qualification.update({
    where: { id },
    data: {
      standard: data.standard,
      fromYear: data.fromYear,
      toYear: data.toYear,
      percentage: data.percentage ?? null,
    },
  });
  return { qualification };
};

//              {Payroll}

// Create Payroll
export const createPayrollService = async (data) => {
  try {
    const {
      employeeId,
      month,
      year,
      baseSalary,
      hra,
      otherAllowances,
      epf,
      esi,
      taxDeduction,
      paymentDate,
      isPaid,
      remarks,
    } = data;

    // Gross Salary Calculation
    const grossSalary = baseSalary + hra + (otherAllowances ?? 0);

    // Total Deductions
    const totalDeductions = (epf ?? 0) + (esi ?? 0) + (taxDeduction ?? 0);

    // Net Pay
    const netPay = grossSalary - totalDeductions;

    const employee = await prisma.employee.findUnique({
      where: { id: data.employeeId },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    const payroll = await prisma.payroll.create({
      data: {
        employeeId,
        month,
        year,
        baseSalary,
        hra,
        otherAllowances,
        grossSalary,
        epf,
        esi,
        taxDeduction,
        totalDeductions,
        netPay,
        paymentDate: paymentDate ? new Date(paymentDate) : null,
        isPaid: isPaid ?? false,
        remarks: remarks ?? "",
      },
    });

    return { payroll };
  } catch (error) {
    console.log(error, "asdlfkjalskdflakdfhjldkj");

    if (error.code === "P2002") {
      throw new Error("Payroll already exists for this month and employee.");
    }

    throw new Error(error);
  }
};

export const getAllPayrollsService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [payrolls, total] = await Promise.all([
    prisma.payroll.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.payroll.count(),
  ]);

  return {
    payrolls,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Payroll by ID
export const getPayrollByIdService = async (id) => {
  const payroll = await prisma.payroll.findUnique({
    where: { id },
  });

  if (!payroll) {
    throw new Error("Payroll not found");
  }

  return { payroll };
};

// List Payrolls by Employee
export const getPayrollsByEmployeeService = async (employeeId) => {
  const payrolls = await prisma.payroll.findMany({
    where: { employeeId },
    orderBy: { createdAt: "desc" }, // Or paymentDate
  });

  return { payrolls };
};

// Update Payroll
export const updatePayrollService = async (id, data) => {
  const {
    baseSalary,
    hra,
    otherAllowances,
    epf,
    esi,
    taxDeduction,
    paymentDate,
    isPaid,
    remarks,
  } = data;

  const grossSalary = baseSalary + hra + (otherAllowances ?? 0);

  const totalDeductions = (epf ?? 0) + (esi ?? 0) + (taxDeduction ?? 0);

  const netPay = grossSalary - totalDeductions;

  const payroll = await prisma.payroll.update({
    where: { id },
    data: {
      baseSalary,
      hra,
      otherAllowances,
      grossSalary,
      epf,
      esi,
      taxDeduction,
      totalDeductions,
      netPay,
      paymentDate: paymentDate ? new Date(paymentDate) : null,
      isPaid,
      remarks,
    },
  });

  return { payroll };
};

// Delete Payroll
export const deletePayrollService = async (id) => {
  await prisma.payroll.delete({
    where: { id },
  });

  return { message: "Payroll deleted successfully" };
};

// Bank Details
export const createBankDetailService = async (data) => {
  return prisma.bankDetail.create({ data });
};

export const updateBankDetailService = async (id, data) => {
  return prisma.bankDetail.update({ where: { id }, data });
};

export const deleteBankDetailService = async (id) => {
  return prisma.bankDetail.delete({ where: { id } });
};

export const getBankDetailsByEmployeeService = async (employeeId) => {
  return prisma.bankDetail.findMany({
    where: { employeeId },
    orderBy: { createdAt: "desc" },
  });
};

export const getBankDetailByIdService = async (id) => {
  return prisma.bankDetail.findUnique({ where: { id } });
};

// EARN AND DEDUCTION
export const getEmployeeEarningsSummary = async (employeeId) => {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employee || !employee.dateOfJoining) {
    throw new Error("Employee or joining date not found");
  }

  const summaries = [];
  const today = new Date();
  const joinDate = new Date(employee.dateOfJoining);

  let cycleStart = new Date(joinDate);
  let cycleEnd = new Date(joinDate);
  if (cycleEnd.getDate() <= 3) {
    cycleEnd.setDate(3);
  } else {
    cycleEnd.setMonth(cycleEnd.getMonth() + 1);
    cycleEnd.setDate(3);
  }

  while (isBefore(cycleStart, today)) {
    const payroll = await prisma.payroll.findFirst({
      where: {
        employeeId,
        paymentDate: {
          gte: startOfDay(cycleStart),
          lte: endOfDay(cycleEnd),
        },
      },
    });

    const leaves = await prisma.leave.findMany({
      where: {
        employeeId,
        status: "APPROVED",
        OR: [
          {
            from: { lte: cycleEnd, gte: cycleStart },
          },
          {
            to: { lte: cycleEnd, gte: cycleStart },
          },
          {
            AND: [{ from: { lte: cycleStart } }, { to: { gte: cycleEnd } }],
          },
        ],
      },
    });

    const leaveDays = leaves.reduce((sum, leave) => {
      const from = new Date(leave.from < cycleStart ? cycleStart : leave.from);
      const to = new Date(leave.to > cycleEnd ? cycleEnd : leave.to);
      return sum + (differenceInCalendarDays(to, from) + 1);
    }, 0);

    // Monthly entitlement
    const leaveEntitlement = 1.5;
    let adjustedLeaveDays = leaveDays;

    //Check for unused Comp Offs in this cycle
    const compOffs = await prisma.compOff.findMany({
      where: {
        employeeId,
        status: { notIn: ["USED", "REJECTED"] },
        workedFrom: { lte: cycleEnd },
        workedTo: { gte: cycleStart },
      },
    });

    const availableCompOffDays = compOffs.reduce(
      (sum, c) => sum + (c.daysGranted ?? 0),
      0
    );

    // Excess leave = leave - entitlement - compOffs
    const excessLeaveDays = Math.max(
      0,
      adjustedLeaveDays - leaveEntitlement - availableCompOffDays
    );

    const baseSalary = payroll?.baseSalary ?? employee.salaryOnJoining ?? 0;
    const totalDaysInCycle = differenceInCalendarDays(cycleEnd, cycleStart) + 1;
    const perDaySalary = baseSalary / totalDaysInCycle;

    const computedDeduction = Math.round(excessLeaveDays * perDaySalary);

    const workingDays = totalDaysInCycle - leaveDays;

    summaries.push({
      cycle: `${cycleStart.toISOString().slice(0, 10)} to ${cycleEnd
        .toISOString()
        .slice(0, 10)}`,
      baseSalary,
      incentives: payroll?.otherAllowances ?? 0,
      deductions: computedDeduction,
      netPay:
        (payroll?.netPay ?? baseSalary + (payroll?.otherAllowances ?? 0)) -
        computedDeduction,
      workingDays,
      leaveDays,
      employeeName: employee.name,
      joinDate: employee.dateOfJoining,
    });

    //Next cycle: 4th to 3rd
    cycleStart = addDays(cycleEnd, 1); // 4th
    cycleEnd = new Date(cycleStart);
    cycleEnd.setMonth(cycleEnd.getMonth() + 1);
    cycleEnd.setDate(3);
  }

  return summaries;
};
