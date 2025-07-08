import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import "@hcaptcha/types";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
      session: Session | null
      user: User | null,
      profile: Tables["profiles"]
    }
    interface PageData {
      session: Session | null
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {}