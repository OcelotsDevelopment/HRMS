import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useNavigate } from "react-router-dom";

interface Event {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: string;
}

type Props = {
  data: Event[];
};

export default function UpcomingEvents({ data }: Props) {
  const navbar = useNavigate();
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-5 pb-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Upcoming Events
        </h3>
        <button
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.05] dark:hover:text-gray-200"
          onClick={() => navbar("/workforce/events")}
        >
          See All
        </button>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Title & Description
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Dates
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Type
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map((event) => (
              <TableRow key={event.id} className="align-top">
                {/* Title & Description */}
                <TableCell className="py-4 text-sm text-gray-800 dark:text-white/90">
                  <div className="font-medium">{event.title}</div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {event.description || "No description provided"}
                  </div>
                </TableCell>

                {/* Date Range */}
                <TableCell className="py-4 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(event.startDate).toLocaleDateString()} —{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </TableCell>

                {/* Type Badge */}
                <TableCell className="py-4 text-sm text-gray-500 dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      event.type === "Success"
                        ? "success"
                        : event.type === "Warning"
                        ? "warning"
                        : event.type === "Danger"
                        ? "error"
                        : "info"
                    }
                  >
                    {event.type}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
