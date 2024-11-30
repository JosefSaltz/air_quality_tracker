<script lang="ts" module>
  import type { Actions } from '@sveltejs/kit';
  import { createClient } from '@supabase/supabase-js';
  import Button from './ui/button/button.svelte';
  import Separator from './ui/separator/separator.svelte';
  import supabase from "$lib/supabase/client";
  // const supabase = createClient(process.env.SUPABASE_PROJECT_URL);
  export const actions = {
    default: async (event) => {
      // Add validation before insert
      // Add the insert action
      // supabase.from().insert()
    }
} satisfies Actions;
</script>

<!-- 
Load the Map View as the splash page
possibly show loading indicator as the data comes in 
-->
<div class="p-10">
  <form method="POST">
    <!-- Add large images for each major type with a horizontal toggle switch -->
    <legend>Odor Type</legend>
    <label for="gas_type">Gas</label>
    <input id="gas_type" name="odor_type" type="radio" />
    <label for="smoke_type">Smoke</label>
    <input id="smoke_type" name="odor_type" type="radio" />
    <Separator class="my-4" />

    <legend>How strong is the smell</legend>
    <label for="faint_input">Faint</label>
    <input id="faint_input" name="odor_strength" type="radio" />
    <label for="strong_input">Strong</label>
    <input id="strong_input" name="odor_strength" type="radio" />
    <label for="overwhelming_input">Overwhelming</label>
    <input id="overwhelming_input" name="odor_strength" type="radio" />
    <Separator class="my-4" />
    
    <legend>Additional Comments</legend>
    <input id="comments_input" class="border" name="comments" type="text" />
    <br />
    <Button class="mt-4" type="submit">Submit</Button>
  </form>
</div>