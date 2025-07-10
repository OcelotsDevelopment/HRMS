import { type JSX, type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

// Generic row type where all values must be renderable (ReactNode)
type RowData = Record<string, ReactNode>;

export interface Column<T extends RowData> {
  key: keyof T;
  label: string;
  isAction?: boolean;
}

export interface DataTableProps<T extends RowData> {
  columns: Column<T>[];
  rows: T[];
  renderActions?: (row: T) => JSX.Element;
}

export default function DataTable<T extends RowData>({
  columns,
  rows,
  renderActions,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    {col.isAction && renderActions
                      ? renderActions(row)
                      : (row[col.key] as ReactNode) ?? "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
