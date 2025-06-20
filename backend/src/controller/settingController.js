import {
  createRegionService,
  getAllRegionsService,
  getRegionByIdService,
  updateRegionService,
  deleteRegionService,

  // Holiday
  createHolidayTypeService,
  getAllHolidayTypesService,
  getHolidayTypeByIdService,
  updateHolidayTypeService,
  deleteHolidayTypeService,
} from "../services/setting.service.js";

export const createRegionController = async (req, res) => {
  try {
    const region = await createRegionService(req.body);
    return res.status(201).json({ success: true, region });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllRegionsController = async (req, res) => {
  try {
    const regions = await getAllRegionsService();
    
    res.status(200).json({ success: true, regions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getRegionByIdController = async (req, res) => {
  try {
    const region = await getRegionByIdService(Number(req.params.id));
    res.status(200).json({ success: true, region });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const updateRegionController = async (req, res) => {
  try {
    const region = await updateRegionService(Number(req.params.id), req.body);
    res.status(200).json({ success: true, region });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteRegionController = async (req, res) => {
  try {
    await deleteRegionService(Number(req.params.id));
    res.status(200).json({ success: true, message: "Region deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


//  Holiday Type

export const createHolidayTypeController = async (req, res) => {
  try {
    const holidayType = await createHolidayTypeService(req.body);
    res.status(201).json({ success: true, holidayType });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllHolidayTypesController = async (req, res) => {
  try {
    const holidayTypes = await getAllHolidayTypesService();
    res.status(200).json({ success: true, holidayTypes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getHolidayTypeByIdController = async (req, res) => {
  try {
    const holidayType = await getHolidayTypeByIdService(Number(req.params.id));
    res.status(200).json({ success: true, holidayType });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const updateHolidayTypeController = async (req, res) => {
  try {
    const holidayType = await updateHolidayTypeService(Number(req.params.id), req.body);
    res.status(200).json({ success: true, holidayType });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteHolidayTypeController = async (req, res) => {
  try {
    await deleteHolidayTypeService(Number(req.params.id));
    res.status(200).json({ success: true, message: "Holiday type deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
