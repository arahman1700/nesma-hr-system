import { PayrollRecord } from "../types";
import { employees } from "./mockEmployees";

export const generatePayrollRecords = (
  months: number = 12,
): PayrollRecord[] => {
  const records: PayrollRecord[] = [];
  const currentYear = 2025;
  const currentMonth = 12;

  for (let monthOffset = 0; monthOffset < months; monthOffset++) {
    let month = currentMonth - monthOffset;
    let year = currentYear;

    if (month <= 0) {
      month = 12 + month;
      year = currentYear - 1;
    }

    const monthStr = `${year}-${month.toString().padStart(2, "0")}`;

    employees.forEach((emp) => {
      if (emp.status !== "Active") return;

      // Calculate earnings
      const basicSalary = emp.basicSalary;
      const housingAllowance = emp.housingAllowance;
      const transportAllowance = emp.transportAllowance;
      const otherAllowances = emp.otherAllowances;

      // Random overtime (0-20 hours at 1.5x hourly rate)
      const overtimeHours = Math.floor(Math.random() * 20);
      const hourlyRate = basicSalary / 22 / 8;
      const overtime = Math.round(overtimeHours * hourlyRate * 1.5);

      // Random bonus (0-20% chance of bonus)
      const bonus =
        Math.random() > 0.8 ? Math.floor(Math.random() * 2000) + 500 : 0;

      // Commission (for sales positions)
      const commission =
        emp.department === "Sales" ? Math.floor(Math.random() * 3000) : 0;

      // Calculate GOSI (9.75% employee, 11.75% company for Saudis; 2% + 2% for non-Saudis)
      const isSaudi = emp.nationality === "Saudi Arabia";
      const gosiBase = basicSalary + housingAllowance;
      const gosiEmployee = isSaudi
        ? Math.round(gosiBase * 0.0975)
        : Math.round(gosiBase * 0.02);
      const gosiCompany = isSaudi
        ? Math.round(gosiBase * 0.1175)
        : Math.round(gosiBase * 0.02);

      // Random absence deduction (0-3 days)
      const absenceDays =
        Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0;
      const absenceDeduction = Math.round((basicSalary / 30) * absenceDays);

      // Loan and advance deductions
      const loanDeduction = Math.random() > 0.9 ? 1000 : 0;
      const advanceDeduction = Math.random() > 0.95 ? 500 : 0;
      const otherDeductions =
        Math.random() > 0.95 ? Math.floor(Math.random() * 500) : 0;

      // Calculate totals
      const grossSalary =
        basicSalary +
        housingAllowance +
        transportAllowance +
        otherAllowances +
        overtime +
        bonus +
        commission;
      const totalDeductions =
        gosiEmployee +
        absenceDeduction +
        loanDeduction +
        advanceDeduction +
        otherDeductions;
      const netSalary = grossSalary - totalDeductions;

      // Determine status based on month
      let status: PayrollRecord["status"];
      if (monthOffset === 0) {
        status = "Draft";
      } else if (monthOffset === 1) {
        status = Math.random() > 0.5 ? "Approved" : "Pending";
      } else {
        status = "Paid";
      }

      const paidDate =
        status === "Paid"
          ? `${year}-${month.toString().padStart(2, "0")}-28`
          : undefined;

      const record: PayrollRecord = {
        id: `payroll-${monthStr}-${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.fullName,
        month: monthStr,
        year,

        basicSalary,
        housingAllowance,
        transportAllowance,
        otherAllowances,
        overtime,
        bonus,
        commission,

        gosiEmployee,
        gosiCompany,
        absenceDeduction,
        loanDeduction,
        advanceDeduction,
        otherDeductions,

        grossSalary,
        totalDeductions,
        netSalary,

        status,
        paidDate,
        paymentMethod: "Bank Transfer",
        createdAt: `${year}-${month.toString().padStart(2, "0")}-25T10:00:00Z`,
      };

      records.push(record);
    });
  }

  return records.sort((a, b) => {
    if (a.month !== b.month) return b.month.localeCompare(a.month);
    return a.employeeName.localeCompare(b.employeeName);
  });
};

export const payrollRecords = generatePayrollRecords(12);

export const getPayrollByMonth = (month: string): PayrollRecord[] => {
  return payrollRecords.filter((p) => p.month === month);
};

export const getPayrollByEmployee = (employeeId: string): PayrollRecord[] => {
  return payrollRecords.filter((p) => p.employeeId === employeeId);
};

export const getPayrollSummary = (month: string) => {
  const records = getPayrollByMonth(month);
  return {
    totalEmployees: records.length,
    totalGross: records.reduce((sum, r) => sum + r.grossSalary, 0),
    totalDeductions: records.reduce((sum, r) => sum + r.totalDeductions, 0),
    totalNet: records.reduce((sum, r) => sum + r.netSalary, 0),
    totalGosi: records.reduce(
      (sum, r) => sum + r.gosiEmployee + r.gosiCompany,
      0,
    ),
    pending: records.filter((r) => r.status === "Pending").length,
    approved: records.filter((r) => r.status === "Approved").length,
    paid: records.filter((r) => r.status === "Paid").length,
  };
};

export default payrollRecords;
