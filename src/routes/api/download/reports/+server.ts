import { createExcelFile } from '$lib/server/createExcel';
import { getMarkers } from '$lib/server/getMarkers';
import { error, fail, json } from '@sveltejs/kit';
import { getAdminReports } from '@/lib/server/getAdminReports.js';
import { checkUserRole } from '@/lib/server/checkUserRole';
import { retrieveDateParams } from '@/lib/server/retrieveDateParams.js';
import { getReports } from '@/lib/server/getReports.js';


export type ReportData = Awaited<ReturnType<typeof getReports> | ReturnType<typeof getAdminReports>>

export const GET = async ({ locals: { safeGetSession, supabase }, url }) => {
  const { user, session } = await safeGetSession();
  const dateRange = retrieveDateParams(url);
  // Destructure the user and supabase clients fr
  // Unauthorized error handling
  if(!user || !session) return error(401, { message: 'User unauthorized'});
  // Validate if the user is admin
  const { isAdmin } = await checkUserRole(user, supabase);
  // Retrieve reports with emails depending on if the user is an admin
  const reportData = isAdmin ? await getAdminReports(supabase, dateRange) : await getReports(supabase, dateRange);
  // Generate the new workbook from the data
  const newWorkbook = await createExcelFile(reportData);
  // Failed workbook handling
  if(!newWorkbook) return error(500, {message: 'Something went wrong trying to retrieve requested data'})
  // Return buffer as a Response
  return new Response(newWorkbook, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="report.xlsx"'
    }
  });
}

export const POST = async ({ locals: { safeGetSession, supabase }, request, url }) => {
  // Check if user is authorized for the request
  const { user, session } = await safeGetSession();
  const dateRange = retrieveDateParams(url);
  // Validate if the user is admin
  const { isAdmin } = await checkUserRole(user, supabase);
  // Auth Guard
  if(!user || !session || !isAdmin) return error(401, { message: 'User unauthorized'});
  // Get the password from the form data
  const { password } = await request.json() as { password: string };
  if(!password) return error(400, { message: 'A password was not passed with the request'});
  // Get Admin report with private data
  const reportData = await getAdminReports(supabase, dateRange);
  if(!reportData) return error(500, '❌ Something went wrong retrieving reports');
  // Respond early if there's no data
  if(!reportData.length) return json(reportData);
  // Generate the new workbook instance
  const newWorkbookBuffer = await createExcelFile(reportData, password);
  if(!newWorkbookBuffer) return error(500, {message: 'Something went wrong trying to retrieve requested data'})
  // Return buffer as a Response
  return new Response(newWorkbookBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="admin_report.xlsx"'
    }
  });
}

