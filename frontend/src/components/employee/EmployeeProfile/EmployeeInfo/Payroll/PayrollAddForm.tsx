import { useState } from "react";
import ComponentCard from "../../../../common/ComponentCard.tsx";
import Input from "../../../../input/InputField.tsx";
import Label from "../../../../form-elements/Label.tsx";
import { useEmployeeStore } from "../../../../../store/employeeStore.ts";
import TextArea from "../../../../input/TextArea.tsx";

interface AddPayrollFormProps {
  employeeId: number;
}

export default function AddPayrollForm({ employeeId }: AddPayrollFormProps) {
  const [month, setMonth] = useState("");
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

  const addPayroll = useEmployeeStore((state) => state.addPayroll);
  const error = useEmployeeStore((state) => state.error);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!month) newErrors.month = "Month is required.";
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
      paymentDate: paymentDate
        ? new Date(paymentDate).toISOString()
        : undefined,
      isPaid,
      remarks,
    });

    // Reset
    // setMonth("");
    // setYear("");
    // setBasicSalary("");
    // setHra("");
    // setOtherAllowances("");
    // setEpf("");
    // setEsi("");
    // setTaxDeduction("");
    // setPaymentDate("");
    // setIsPaid(false);
    // setRemarks("");
  };

  return (
    <ComponentCard title="Add Payroll">
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {error && <p className="text-red-400">{error}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Month</Label>
            <Input
              type="number"
              min={"1"}
              max={"12"}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="Month (1-12)"
              error={!!errors.month}
              hint={errors.month || ""}
            />
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
