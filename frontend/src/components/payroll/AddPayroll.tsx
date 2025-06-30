import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard.tsx";
import Input from "../input/InputField.tsx";
import Label from "../form-elements/Label.tsx";
import TextArea from "../input/TextArea.tsx";
import Select from "../form/Select.tsx";
import { useEmployeeStore } from "../../store/employeeStore.ts";

interface AddPayrollFormProps {
  employeeId?: number; // now optional
}

const monthOptions = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

export default function AddPayroll({ employeeId: defaultEmpId }: AddPayrollFormProps) {
  const [employeeId, setEmployeeId] = useState(defaultEmpId || 0);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [hra, setHra] = useState("");
  const [otherAllowances, setOtherAllowances] = useState("");
  const [epf, setEpf] = useState("");
  const [esi, setEsi] = useState("");
  const [taxDeduction, setTaxDeduction] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [remarks, setRemarks] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { employees, fetchEmployees, addPayroll, error } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!employeeId) newErrors.employeeId = "Employee is required.";
    if (!month || month <= 0) newErrors.month = "Month is required.";
    if (!year) newErrors.year = "Year is required.";
    if (!basicSalary) newErrors.basicSalary = "Base salary is required.";
    if (!hra) newErrors.hra = "HRA is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const grossSalary =
      Number(basicSalary) + Number(hra) + Number(otherAllowances || 0);
    const totalDeductions =
      Number(epf || 0) + Number(esi || 0) + Number(taxDeduction || 0);
    const netPay = grossSalary - totalDeductions;

    await addPayroll({
      employeeId,
      month: Number(month),
      year: Number(year),
      baseSalary: Number(basicSalary),
      hra: Number(hra),
      otherAllowances: Number(otherAllowances || 0),
      epf: Number(epf || 0),
      esi: Number(esi || 0),
      totalDeductions,
      netPay,
      taxDeduction: Number(taxDeduction || 0),
      paymentDate: paymentDate ? new Date(paymentDate).toISOString() : undefined,
      isPaid,
      remarks,
    });
  };

  return (
    <ComponentCard title="Add Payroll">
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {error && <p className="text-red-400">{error}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Employee</Label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(Number(e.target.value))}
              className="w-full rounded border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value={0}>Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p className="mt-1 text-sm text-red-500">{errors.employeeId}</p>
            )}
          </div>

          <div>
            <Label>Month</Label>
            <Select
              options={monthOptions}
              placeholder="Select month"
              onChange={(value) => setMonth(value)}
              value={month}
              className="dark:bg-dark-900"
            />
            {errors.month && (
              <p className="mt-1 text-sm text-red-500">{errors.month}</p>
            )}
          </div>

          <div>
            <Label>Year</Label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year (e.g., 2025)"
              error={!!errors.year}
              hint={errors.year || ""}
            />
          </div>

          <div>
            <Label>Base Salary</Label>
            <Input
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              placeholder="Enter base salary"
              error={!!errors.basicSalary}
              hint={errors.basicSalary || ""}
            />
          </div>

          <div>
            <Label>HRA</Label>
            <Input
              type="number"
              value={hra}
              onChange={(e) => setHra(e.target.value)}
              placeholder="House Rent Allowance"
              error={!!errors.hra}
              hint={errors.hra || ""}
            />
          </div>

          <div>
            <Label>Other Allowances</Label>
            <Input
              type="number"
              value={otherAllowances}
              onChange={(e) => setOtherAllowances(e.target.value)}
              placeholder="Travel, food, etc. (optional)"
            />
          </div>

          <div>
            <Label>EPF</Label>
            <Input
              type="number"
              value={epf}
              onChange={(e) => setEpf(e.target.value)}
              placeholder="Provident Fund (optional)"
            />
          </div>

          <div>
            <Label>ESI</Label>
            <Input
              type="number"
              value={esi}
              onChange={(e) => setEsi(e.target.value)}
              placeholder="Insurance (optional)"
            />
          </div>

          <div>
            <Label>Tax Deduction</Label>
            <Input
              type="number"
              value={taxDeduction}
              onChange={(e) => setTaxDeduction(e.target.value)}
              placeholder="TDS, etc. (optional)"
            />
          </div>

          <div>
            <Label>Payment Date</Label>
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
            <Label>Mark as Paid</Label>
          </div>
        </div>

        <div>
          <Label>Remarks</Label>
          <TextArea
            value={remarks}
            onChange={(value) => setRemarks(value)}
            placeholder="Additional notes or remarks"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Submit Payroll
        </button>
      </form>
    </ComponentCard>
  );
}