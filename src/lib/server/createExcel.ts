import Excel from "exceljs";
import officeCrypto from "officecrypto-tool";
import { type ReportData } from "@/routes/api/download/reports/+server";
// Utility function for preparing an Excel file to send to the user
export const createExcelFile = async (reportData: ReportData, password?: string) => {
  if(!reportData) return;
  const { markerReports, uniqueLogins } = reportData;
  // Null Guard
  if(!markerReports || !markerReports.length) return;
  // Instantiate new Workbook
  const workbook = new Excel.Workbook();
  // Assign Workbook Metadata
  [workbook.creator, workbook.lastModifiedBy] = 'PIITA';
  workbook.created = new Date();
  // Create the worksheet with report data
  const worksheet = workbook.addWorksheet('Report Data');
  const markerHeaders = Object.keys(markerReports[0]);
  // Create column headers
  const headers = uniqueLogins ? [ ...markerHeaders, "Unique Logins"] : markerHeaders;
  const extrapolatedColumns = headers.map(header => ({ header, key: header}));
  worksheet.columns = extrapolatedColumns;
  // Prepend a row of the unique login count
  if(uniqueLogins) worksheet.addRow({ "Unique Logins": uniqueLogins})
  // Add all the marker data rows
  markerReports.forEach(report => worksheet.addRow(report));
  // Generate the buffer for the Excel file
  const workbookBuffer = await workbook.xlsx.writeBuffer();
  // Return an encrypted copy if there's a password present
  if(password) {
    console.log(`Encrypting...`)
    // Ignore the Buffer type issue
    return officeCrypto.encrypt(workbookBuffer, { password })
  }
  // Otherwise return the plain buffer
  return workbookBuffer;
}