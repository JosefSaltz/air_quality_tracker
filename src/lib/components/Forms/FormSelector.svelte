<script lang="ts">
  import supabase from "@/lib/utils/client";
  import { LoginForm, SignUpForm, ReportForm } from "./FormTypes/index";
  import { onMount } from "svelte";
  import type { Session } from "@supabase/supabase-js";
  const forms = {
    'login': LoginForm,
    'sign-in': SignUpForm,
    'report': ReportForm
  } as const;
  
  let userLoggedIn = $state<Session | null>(null);
  let selectedForm = $state<keyof typeof forms>('login');

  onMount(async () => {
    let { data } = await supabase.auth.getSession();
    userLoggedIn = data.session;
  });
  
</script>

{#if userLoggedIn}
  <ReportForm />
{:else}
{/if}
