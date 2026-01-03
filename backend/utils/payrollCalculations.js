// utils/payrollCalculations.js

exports.calculatePayroll = (employee, presentDays, workingDays) => {
  // ✅ Ensure numeric values (avoid NaN)
  const basicSalary = Number(employee.salary?.basicSalary) || 0;
  const hra = Number(employee.salary?.hra) || 0;
  const da = Number(employee.salary?.da) || 0;
  const otherAllowances = Number(employee.salary?.otherAllowances) || 0;

  const pf = Number(employee.deductions?.pf) || 0;
  const tax = Number(employee.deductions?.tax) || 0;
  const insurance = Number(employee.deductions?.insurance) || 0;

  // ✅ Daily pay based on working days (avoid division by zero)
  const dailyPay = workingDays > 0 ? basicSalary / workingDays : 0;

  // ✅ Adjust salary based on attendance
  const attendanceFactor = presentDays / (workingDays || 1);

  const adjustedBasic = basicSalary * attendanceFactor;
  const adjustedHra = hra * attendanceFactor;
  const adjustedDa = da * attendanceFactor;
  const adjustedAllowances = otherAllowances * attendanceFactor;

  // ✅ Compute totals
  const grossSalary =
    adjustedBasic + adjustedHra + adjustedDa + adjustedAllowances;

  const totalDeductions = pf + tax + insurance;

  const netSalary = grossSalary - totalDeductions;

  // ✅ Return all fields in correct schema structure
  return {
    earnings: {
      basicSalary: adjustedBasic,
      hra: adjustedHra,
      da: adjustedDa,
      otherAllowances: adjustedAllowances,
    },
    deductions: {
      pf,
      tax,
      insurance,
    },
    grossSalary,
    totalDeductions,
    netSalary,
  };
};
