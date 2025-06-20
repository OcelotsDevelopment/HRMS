import {
  createHolidayService,
  getAllHolidaysService,
  getHolidayByIdService,
  updateHolidayService,
  deleteHolidayService,
} from "../services/workforce.service.js";

export const createHolidayController = async (req, res) => {
  try {
    const result = await createHolidayService(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllHolidaysController = async (req, res) => {
  try {
    const result = await getAllHolidaysService();
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getHolidayByIdController = async (req, res) => {
  try {
    const result = await getHolidayByIdService(Number(req.params.id));
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const updateHolidayController = async (req, res) => {
  try {
    const result = await updateHolidayService(Number(req.params.id), req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteHolidayController = async (req, res) => {
  try {
    await deleteHolidayService(Number(req.params.id));
    res.status(200).json({ success: true, message: "Holiday deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
