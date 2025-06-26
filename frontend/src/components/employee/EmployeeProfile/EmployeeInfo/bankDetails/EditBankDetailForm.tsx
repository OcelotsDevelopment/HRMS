import React, { useEffect, useState } from "react";
import Label from "../../../../form/Label";
import Input from "../../../../input/InputField";
import Button from "../../../../ui/button/Button";
import { useEmployeeStore } from "../../../../../store/employeeStore";
import { useModal } from "../../../../../hooks/useModal";

interface EditBankDetailFormProps {
  bankDetail: {
    id: number;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch?: string;
    accountType?: string;
    upiId?: string;
    employeeId: number;
  };
  onSuccess?: () => void;
}


type BankDetailFormState = {
  id: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch?: string;
  accountType?: string;
  upiId?: string;
  employeeId: number;
};

const EditBankDetailForm = ({
  bankDetail,
  onSuccess,
}: EditBankDetailFormProps) => {
  const { closeModal } = useModal();
  const { updateBankDetail, error } = useEmployeeStore();

  const [form, setForm] = useState<BankDetailFormState>({
    id: 0,
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    accountType: "",
    upiId: "",
    employeeId: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});


  useEffect(() => {
  if (bankDetail) {
    setForm(bankDetail);
  }
}, [bankDetail]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.bankName.trim()) errs.bankName = "Bank name is required.";
    if (!form.accountNumber.trim())
      errs.accountNumber = "Account number is required.";
    if (!form.ifscCode.trim()) errs.ifscCode = "IFSC code is required.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    await updateBankDetail(form.id, form);
    if (onSuccess) onSuccess();
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
        Edit Bank Detail
      </h5>
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Bank Name</Label>
          <Input
            name="bankName"
            value={form.bankName}
            onChange={handleChange}
            error={!!errors.bankName}
            hint={errors.bankName}
          />
        </div>
        <div>
          <Label>Account Number</Label>
          <Input
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            error={!!errors.accountNumber}
            hint={errors.accountNumber}
          />
        </div>
        <div>
          <Label>IFSC Code</Label>
          <Input
            name="ifscCode"
            value={form.ifscCode}
            onChange={handleChange}
            error={!!errors.ifscCode}
            hint={errors.ifscCode}
          />
        </div>
        <div>
          <Label>Branch</Label>
          <Input
            name="branch"
            value={form.branch || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Account Type</Label>
          <Input
            name="accountType"
            value={form.accountType || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>UPI ID</Label>
          <Input
            name="upiId"
            value={form.upiId || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={closeModal}>
          Cancel
        </Button>
        <Button size="sm">Update Bank Detail</Button>
      </div>
    </form>
  );
};

export default EditBankDetailForm;
