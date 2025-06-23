import Excel from "exceljs";
import { type ReportData } from "@/routes/api/download/reports/+server";
// Utility function for preparing an Excel file to send to the user
export const createExcelFile = async (reportData: ReportData, password?: string) => {
  // Null Guard
  if(!reportData || !reportData.length) return;
  // Instantiate new Workbook
  const workbook = new Excel.Workbook();
  // Assign Workbook Metadata
  [workbook.creator, workbook.lastModifiedBy] = 'PIITA';
  workbook.created = new Date();
  // Create the worksheet with report data
  const worksheet = workbook.addWorksheet('Report Data');
  // Create column headers
  const headers = Object.keys(reportData[0]);
  const extrapolatedColumns = headers.map(header => ({ header, key: header}));
  worksheet.columns = extrapolatedColumns;
  // Add all the data rows
  reportData.forEach(report => worksheet.addRow(report));
  // Set the password for the workbook
  const protectOptions = {} satisfies Partial<Excel.WorksheetProtection>;
  if(password) await worksheet.protect(password, protectOptions)
  // Return generated workbook
  return workbook;
}