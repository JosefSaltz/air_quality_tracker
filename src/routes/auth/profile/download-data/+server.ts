import { error } from '@sveltejs/kit';
import Excel from "exceljs";
import { getAdminReports } from '$lib/server/getAdminReports.js';
import { getMarkers } from '@/lib/server/getMarkers.js';

type ReportData = Awaited<ReturnType<typeof getMarkers> | ReturnType<typeof getAdminReports>>

// Utility function for preparing an Excel file to send to the user
const createExcelFile = async (reportData: ReportData, password?: string) => {
  // Null Guard
  if(!reportData || !reportData.length) return;
  // Instantiate new Workbook
  const workbook = new Excel.Workbook();
  // Assign Workbook Metadata
  [workbook.creator, workbook.lastModifiedBy] = 'PIITA';
  [workbook.created, workbook.modified] = new Date();
  // Create the worksheet with report data
  const worksheet = workbook.addWorksheet('Report Data');
  // Create column headers
  const headers = Object.keys(reportData[0]);
  const extrapolatedColumns = headers.map(header => ({ header, key: header}));
  worksheet.columns = extrapolatedColumns;
  // Add all the data rows
  reportData.forEach(report => worksheet.addRow(report));
  // Set the password for the workbook
  const protectOptions = {};
  if(password) await worksheet.protect(password, protectOptions)
  // Return generated workbook
  return workbook;
}

// Regular data report GET request
export const GET = async({ locals }) => {
  const { user, supabase } = locals;
  if(!user) return error(401, { message: 'User unauthorized'});
  const reportData = await getMarkers(supabase);
  const newWorkbook = await createExcelFile(reportData);
  if(!newWorkbook) return error(500, {message: 'Something went wrong trying to retrieve requested data'})
  // Generate the buffer for the Excel file
	const buffer = await newWorkbook.xlsx.writeBuffer();
  // Return buffer as a Response
  return new Response(buffer, {
		headers: {
			'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': 'attachment; filename="report.xlsx"'
		}
	});
}
// Admin POST request with form data;
export const POST = async({ locals, request }) => {
  // Check if user is authorized for the request
  const { user, supabase } = locals;
  if(!user || user.role !== 'admin') return error(401, { message: 'User unauthorized'});
  // Get the password from the form data
  const formData = await request.formData();
  const password = formData.get('password') as string | null;
  if(!password) return error(400, { message: 'A password was not passed with the request'});
  const reportData = await getAdminReports(supabase);
  const newWorkbook = await createExcelFile(reportData, password);
  if(!newWorkbook) return error(500, {message: 'Something went wrong trying to retrieve requested data'})
  // Generate the buffer for the Excel file
	const buffer = await newWorkbook.xlsx.writeBuffer();
  // Return buffer as a Response
  return new Response(buffer, {
		headers: {
			'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': 'attachment; filename="report.xlsx"'
		}
	});
}