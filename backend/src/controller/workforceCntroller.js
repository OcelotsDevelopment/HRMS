import {
  createHolidayService,
  getAllHolidaysService,
  getHolidayByIdService,
  updateHolidayService,
  deleteHolidayService,

  // leave
  createLeaveService,
  getAllLeavesService,
  getLeaveByIdService,
  updateLeaveService,
  deleteLeaveService,

  // event
  createEventService,
  getAllEventsService,
  getEventByIdService,
  updateEventService,
  deleteEventService,
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

//  leave
// Create Leave
export const createLeaveController = async (req, res) => {
  try {
    const leave = await createLeaveService(req.body);
    res.status(201).json({ success: true, leave });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get All Leaves
export const getAllLeavesController = async (req, res) => {
  try {
    const leaves = await getAllLeavesService();
    res.status(200).json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Leave by ID
export const getLeaveByIdController = async (req, res) => {
  try {
    const leave = await getLeaveByIdService(Number(req.params.id));
    res.status(200).json({ success: true, leave });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// Update Leave
export const updateLeaveController = async (req, res) => {
  try {
    const leave = await updateLeaveService(Number(req.params.id), req.body);
    res.status(200).json({ success: true, leave });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete Leave
export const deleteLeaveController = async (req, res) => {
  try {
    await deleteLeaveService(Number(req.params.id));
    res.status(200).json({ success: true, message: "Leave deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Event

// ✅ Create Event
export const createEventController = async (req, res) => {
  try {
    const result = await createEventService(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Get All Events
export const getAllEventsController = async (req, res) => {
  try {
    const result = await getAllEventsService();
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Event by ID
export const getEventByIdController = async (req, res) => {
  try {
    const result = await getEventByIdService(Number(req.params.id));
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// ✅ Update Event
export const updateEventController = async (req, res) => {
  try {
    const result = await updateEventService(Number(req.params.id), req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Delete Event
export const deleteEventController = async (req, res) => {
  try {
    await deleteEventService(Number(req.params.id));
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
