import { createExcelFile } from '$lib/server/createExcel';
import { getAdminReports } from '@/lib/server/getAdminReports.js';
import { error } from '@sveltejs/kit';

export const POST = async ({ locals, request }) => {
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