import asyncHandler from "express-async-handler";
import {
  createEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
  // Employment
  addEmploymentService,
  listEmploymentService,
  getEmploymentByIdService,
  updateEmploymentService,
  deleteEmploymentService,

  // qualification
  addQualificationService,
  listQualificationService,
  getQualificationByIdService,
  updateQualificationService,

  // Payroll
  createPayrollService,
  getAllPayrollsService,
  getPayrollByIdService,
  getPayrollsByEmployeeService,
  updatePayrollService,
  deletePayrollService,

  // Bank details
  createBankDetailService,
  updateBankDetailService,
  deleteBankDetailService,
  getBankDetailsByEmployeeService,
  getBankDetailByIdService,
  uploadEmployeeImageService,
  getEmployeeEarningsSummary,
} from "../services/employee.service.js";

// @desc    Create new employee
// @route   POST /api/employee
export const createEmployee = asyncHandler(async (req, res) => {
  console.log(req.body, "dfkshdflkhsdlf");

  const result = await createEmployeeService(req.body);
  res.status(201).json(result);
});

// @desc    Get all employees
// @route   GET /api/employee
export const getAllEmployees = asyncHandler(async (req, res) => {
  const result = await getAllEmployeesService();
  res.status(200).json(result);
});

// @desc    Get employee by ID
// @route   GET /api/employee/:id
export const getEmployeeById = asyncHandler(async (req, res) => {
  const result = await getEmployeeByIdService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc    Update employee
// @route   PUT /api/employee/:id
export const updateEmployee = asyncHandler(async (req, res) => {
  const result = await updateEmployeeService(Number(req.params.id), req.body);
  res.status(200).json(result);
});

// @desc    Add employment for an employee
// @route   POST /api/employee/:id/employment
export const addEmployment = asyncHandler(async (req, res) => {
  const result = await addEmploymentService(req.body);
  res.status(201).json(result);
});

// @desc    List all employments for an employee
// @route   GET /api/employee/:id/employment
export const listEmployment = asyncHandler(async (req, res) => {
  const result = await listEmploymentService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc    Get single employment by ID
// @route   GET /api/employee/employment/:employmentId
export const getEmploymentById = asyncHandler(async (req, res) => {
  const result = await getEmploymentByIdService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc    Update employment
// @route   PUT /api/employee/employment/:employmentId
export const updateEmployment = asyncHandler(async (req, res) => {
  const employmentId = Number(req.params.employmentId);
  if (isNaN(employmentId)) {
    res.status(400).json({ message: "Invalid employment ID" });
    return;
  }

  const result = await updateEmploymentService(employmentId, req.body);
  res.status(200).json(result);
});

// @desc    Update employment
// @route   PUT /api/employee/uploadProfile
export const uploadEmployeeImageController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required." });
    }

    const imageUrl = await uploadEmployeeImageService(
      id,
      req.file.path,
      req.file.originalname
    );

    res.json({
      success: true,
      message: "Image uploaded and saved successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Image Upload Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete employment
// @route   DELETE /api/employee/employment/:employmentId
export const deleteEmployment = asyncHandler(async (req, res) => {
  const result = await deleteEmploymentService(Number(req.params.employmentId));
  res.status(200).json(result);
});

// @desc Add qualification
// @route   POST /api/employee/qualification/
export const addQualification = asyncHandler(async (req, res) => {
  const result = await addQualificationService(req.body);
  res.status(201).json(result);
});

// @desc List all qualifications for an employee
// @route   Get /api/employee/qualifications/
export const listQualification = asyncHandler(async (req, res) => {
  const result = await listQualificationService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc Get single qualification by ID
// @route   Get /api/employee/qualification/:qualificationId
export const getQualificationById = asyncHandler(async (req, res) => {
  const result = await getQualificationByIdService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc Update qualification
// @route   PUT /api/employee/qualification/:qualificationId
export const updateQualification = asyncHandler(async (req, res) => {
  const result = await updateQualificationService(
    Number(req.params.qualificationId),
    req.body
  );
  res.status(200).json(result);
});

//      Payroll

// @desc    Add single employment by ID
// @route   POST /api/employee/payroll/
export const createPayroll = asyncHandler(async (req, res) => {
  const result = await createPayrollService(req.body);
  res.status(201).json(result);
});

// @desc    Fetch single employment by ID
// @route   GET /api/employee/allpayroll
// Get All Payrolls (Paginated)
export const getAllPayrollsController = async (req, res) => {
  try {
    console.log("============================================");

    // Support both query (?page=1&limit=10) and path (/payrollAll/1/10)
    const page = parseInt(req.query.page || req.params.page || "1", 10);
    const limit = parseInt(req.query.limit || req.params.limit || "10", 10);

    const data = await getAllPayrollsService(page, limit);

    res.json({
      success: true,
      message: "Payrolls fetched successfully",
      payrolls: data.payrolls,
      pagination: data.pagination,
    });
  } catch (error) {
    console.error("GetAllPayrolls Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// @desc    Fetch single employment by ID
// @route   GET /api/employee/payrollById/:id
export const getPayrollById = asyncHandler(async (req, res) => {
  const result = await getPayrollByIdService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc    Fetch single employment by ID
// @route   GET /api/employee/payroll/
export const getPayrollsByEmployee = asyncHandler(async (req, res) => {
  const result = await getPayrollsByEmployeeService(
    Number(req.params.employeeId)
  );
  res.status(200).json(result);
});

// @desc    Edit single employment by ID
// @route   PUT /api/employee/payroll/update
export const updatePayroll = asyncHandler(async (req, res) => {
  const result = await updatePayrollService(Number(req.params.id), req.body);
  res.status(200).json(result);
});

// @desc    Delete single employment by ID
// @route   DELETE /api/employee/payroll/delete
export const deletePayroll = asyncHandler(async (req, res) => {
  const result = await deletePayrollService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc    Create bank detail
// @route   POST /api/employee/bank
export const createBankDetail = asyncHandler(async (req, res) => {
  const result = await createBankDetailService(req.body);
  res.status(201).json(result);
});

// @desc    Update bank detail
// @route   PUT /api/employee/bank/:id
export const updateBankDetail = asyncHandler(async (req, res) => {
  const result = await updateBankDetailService(Number(req.params.id), req.body);
  res.status(200).json(result);
});

// @desc    Delete bank detail
// @route   DELETE /api/employee/bank/:id
export const deleteBankDetail = asyncHandler(async (req, res) => {
  const result = await deleteBankDetailService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc    Get all bank details by employee
// @route   GET /api/employee/bank/employee/:employeeId
export const getBankDetailsByEmployee = asyncHandler(async (req, res) => {
  const result = await getBankDetailsByEmployeeService(
    Number(req.params.employeeId)
  );

  res.status(200).json(result);
});

// @desc    Get single bank detail by ID
// @route   GET /api/employee/bank/:id
export const getBankDetailById = asyncHandler(async (req, res) => {
  const result = await getBankDetailByIdService(Number(req.params.id));
  res.status(200).json(result);
});


// @desc    Get single bank detail by ID
// @route   GET api/employee/:id/earnings-summary
export const getEarningsSummaryController = async (req, res) => {
  try {
    const employeeId = parseInt(req.params.id);    
    const data = await getEmployeeEarningsSummary(employeeId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
