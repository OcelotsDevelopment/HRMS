import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useEffect, useState, type JSX } from "react";
import { useUserStore } from "../../../store/userStore";

interface UserRow {
  id: number;
  name: string;
  email: string;
  image?: string;
  role?: string;
  action: JSX.Element;
}

interface UserTableProps {
  openModal: (id: number) => void;
}

export default function UserTable({ openModal }: UserTableProps) {
  const [tableData, setTableData] = useState<UserRow[]>([]);
  const findUsers = useUserStore((state) => state.findUsers);
  const fetchUsers = useUserStore((state) => state.fetchUsers);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const formatted = findUsers.map((user) => ({
      ...user,
      action: (
        <button
          onClick={() => openModal(user.id)}
          className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          Edit
        </button>
      ),
    }));
    setTableData(formatted);
  }, [findUsers]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Name</TableCell>
              <TableCell isHeader>Email</TableCell>
              <TableCell isHeader>Role</TableCell>
              <TableCell isHeader>Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role ?? "—"}</TableCell>
                <TableCell>{user.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
