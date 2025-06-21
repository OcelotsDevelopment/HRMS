import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import { useSettingStore } from "../store/settingStore";
import { useWorkforceStore } from "../store/workforceStore";
import Input from "../components/input/InputField";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import TextArea from "../components/input/TextArea";

const Calendar = () => {
  const { fetchEvents, events, addEvent, updateEvent } = useWorkforceStore();
  const { regions, fetchRegions } = useSettingStore();
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const [form, setForm] = useState({
    id: undefined as number | undefined,
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    calendar: "",
    regionId: "" as number | "", // ← updated type
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchEvents();
    fetchRegions();
  }, [fetchEvents, fetchRegions]);

  const resetForm = () => {
    setForm({
      id: undefined,
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      calendar: "",
      regionId: "",
    });
    setErrors({});
  };

  const goToDate = (year: number, month: number) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(new Date(year, month, 1)); // month is 0-indexed
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetForm();
    setForm((prev) => ({
      ...prev,
      startDate: selectInfo.startStr,
      endDate: selectInfo.endStr || selectInfo.startStr,
    }));
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setForm({
      id: Number(event.id),
      title: event.title,
      description: event.extendedProps.description || "",
      startDate: event.start?.toISOString().slice(0, 10) || "",
      endDate: event.end?.toISOString().slice(0, 10) || "",
      calendar: event.extendedProps.calendar,
      regionId: event.extendedProps.regionId || "",
    });
    openModal();
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.calendar) newErrors.calendar = "Calendar type is required";
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description,
      startDate: new Date(form.startDate).toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      calendar: form.calendar,
      regionId: form.regionId ? Number(form.regionId) : null,
    };

    try {
      if (form.id) {
        await updateEvent(form.id, payload);
      } else {
        await addEvent(payload);
      }
      closeModal();
      resetForm();
    } catch (err) {
      console.error("Failed to save event:", err);
    }
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar?.toLowerCase()}`;
    return (
      <div
        className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
      >
        <div className="fc-daygrid-event-dot"></div>
        <div className="fc-event-time">{eventInfo.timeText}</div>
        <div className="fc-event-title">{eventInfo.event.title}</div>
      </div>
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleTextareaChange = (value: string) => {
    setForm((prev) => ({ ...prev, description: value }));
  };

  return (
    <>
      <PageMeta title="Calendar" description="View all holidays and events" />
      <div className="rounded-2xl border bg-white p-4 dark:bg-gray-900">
        <div className="flex gap-3 mb-4">
          <select
            onChange={(e) =>
              goToDate(Number(e.target.value), new Date().getMonth())
            }
          >
            {Array.from({ length: 100 }, (_, i) => 2025 - i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            onChange={(e) =>
              goToDate(new Date().getFullYear(), Number(e.target.value))
            }
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          events={events.map((e) => ({
            id: String(e.id),
            title: e.title,
            start: e.startDate,
            end: e.endDate,
            extendedProps: {
              calendar: e.type,
              regionId: e.regionId,
              description: e.description,
            },
          }))}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              click: () => {
                resetForm();
                openModal();
              },
            },
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            // right: "dayGridMonth,timeGridWeek,timeGridDay",
            right: "dayGridMonth",
          }}
          views={{
            dayGridMonth: {
              titleFormat: { year: "numeric", month: "long" },
            },
          }}
          showNonCurrentDates={true}
          height="auto"
          navLinks={true}
        />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          {form.id ? "Edit Event" : "Add Event"}
        </h2>

        <div className="space-y-4">
          <div>
            <Input
              type="text"
              name="title"
              placeholder="Enter event title"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              hint={errors.title}
            />
          </div>

          <div>
            <Label>Remarks</Label>
            <TextArea
              placeholder="Description"
              value={form.description}
              onChange={handleTextareaChange}
              error={false}
              hint={""}
            />
          </div>

          <div>
            <Input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              error={!!errors.startDate}
              hint={errors.startDate}
            />
          </div>

          <div>
            <Input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              error={false}
              hint=""
            />
          </div>

          <div className="mt-6">
            <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
              Event Category
            </label>
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              {Object.entries({
                Danger: "danger",
                Success: "success",
                Primary: "primary",
                Warning: "warning",
              }).map(([key, value]) => (
                <div key={key} className="n-chk">
                  <div
                    className={`form-check form-check-${value} form-check-inline`}
                  >
                    <label
                      className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                      htmlFor={`modal${key}`}
                    >
                      <span className="relative">
                        <input
                          className="sr-only form-check-input"
                          type="radio"
                          name="calendar"
                          value={key}
                          id={`modal${key}`}
                          checked={form.calendar === key}
                          onChange={() =>
                            setForm((prev) => ({ ...prev, calendar: key }))
                          }
                        />
                        <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                          <span
                            className={`h-2 w-2 rounded-full bg-white ${
                              form.calendar === key ? "block" : "hidden"
                            }`}
                          ></span>
                        </span>
                      </span>
                      {key}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {errors.calendar && (
              <p className="mt-2 text-sm text-red-500">{errors.calendar}</p>
            )}
          </div>

          <div>
            <Label>Region (Optional)</Label>
            <Select
              options={regions.map((r) => ({ label: r.name, value: r.id }))}
              placeholder="Select Region"
              onChange={(val) =>
                setForm((prev) => ({ ...prev, regionId: val as number }))
              }
              value={form.regionId}
            />
            {errors.regionId && (
              <p className="text-sm text-red-500">{errors.regionId}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={closeModal}
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {form.id ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Calendar;
