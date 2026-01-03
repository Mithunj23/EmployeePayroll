const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

// Department-wise salary report
exports.getDepartmentWiseReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const payrolls = await Payroll.find({
      month: parseInt(month),
      year: parseInt(year)
    }).populate('employeeId');

    const departmentData = {};
    
    payrolls.forEach(payroll => {
      const dept = payroll.employeeId.department;
      if (!departmentData[dept]) {
        departmentData[dept] = {
          department: dept,
          employeeCount: 0,
          totalGrossSalary: 0,
          totalDeductions: 0,
          totalNetSalary: 0
        };
      }
      
      departmentData[dept].employeeCount++;
      departmentData[dept].totalGrossSalary += payroll.grossSalary;
      departmentData[dept].totalDeductions += payroll.totalDeductions;
      departmentData[dept].totalNetSalary += payroll.netSalary;
    });

    const report = Object.values(departmentData);

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Monthly salary summary
exports.getMonthlySummary = async (req, res) => {
  try {
    const { year } = req.query;
    
    const payrolls = await Payroll.find({ year: parseInt(year) });

    const monthlyData = Array(12).fill(null).map((_, index) => ({
      month: index + 1,
      totalGrossSalary: 0,
      totalDeductions: 0,
      totalNetSalary: 0,
      employeeCount: 0
    }));

    payrolls.forEach(payroll => {
      const monthIndex = payroll.month - 1;
      monthlyData[monthIndex].totalGrossSalary += payroll.grossSalary;
      monthlyData[monthIndex].totalDeductions += payroll.totalDeductions;
      monthlyData[monthIndex].totalNetSalary += payroll.netSalary;
      monthlyData[monthIndex].employeeCount++;
    });

    res.json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Year-on-year comparison
exports.getYearlyComparison = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear];

    const yearlyData = await Promise.all(
      years.map(async (year) => {
        const payrolls = await Payroll.find({ year });
        
        const totalGross = payrolls.reduce((sum, p) => sum + p.grossSalary, 0);
        const totalNet = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
        
        return {
          year,
          totalGrossSalary: totalGross,
          totalNetSalary: totalNet,
          employeeCount: new Set(payrolls.map(p => p.employeeId.toString())).size
        };
      })
    );

    res.json({
      success: true,
      data: yearlyData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
