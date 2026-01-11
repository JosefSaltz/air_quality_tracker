import { supabaseAdmin } from "../utils/client";

export async function getUniqueLogins() {
  // Get the first day of the current month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // We use the admin API to list users
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) throw error;

  // Filter users whose last login was after the start of this month
  const uniqueLogins = users.filter(user => 
    user.last_sign_in_at && user.last_sign_in_at >= firstDayOfMonth
  ).length;

  return { uniqueLogins };
}