import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PayrollTable from "../../components/payroll/PayrollTable";
import ComponentCard from "../../components/common/ComponentCard";
import { useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal";
import AddPayroll from "../../components/payroll/AddPayroll";
import { useEmployeeStore } from "../../store/employeeStore";

export default function ViewPayrollPage() {
  const [open, setOpen] = useState(false);

  const { payrolls } = useEmployeeStore();

  useEffect(() => {
    if (payrolls) {
      setOpen(false);
    }
  }, [payrolls]);

  return (
    <>
      <PageMeta
        title="Payroll Details"
        description="Payroll information for employee"
      />
      <PageBreadcrumb pageTitle="Employee Payroll" />
      <ComponentCard
        title="Payroll Table"
        buttonTitle="Add Payroll"
        handleButtonClick={() => setOpen(true)}
      >
        <div className="space-y-6">
          <PayrollTable />
        </div>
      </ComponentCard>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        className="max-w-[700px] m-4"
      >
        <AddPayroll />
      </Modal>
    </>
  );
}
