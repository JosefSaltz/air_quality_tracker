import { createExcelFile } from '$lib/server/createExcel';
import { getMarkers } from '$lib/server/getMarkers';
import { error } from '@sveltejs/kit';

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