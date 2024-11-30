<script lang="ts" module>
  import type { Actions } from '@sveltejs/kit';
  import { createClient } from '@supabase/supabase-js';
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
<form method="POST">
  <!-- Add large images for each major type with a horizontal toggle switch -->
  <legend>Odor Type</legend>
  <label for="gas_type">Gas</label>
  <input id="gas_type" name="odor_type" type="radio" />
  <label for="smoke_type">Smoke</label>
  <input id="smoke_type" name="odor_type" type="radio" />

  <legend>How strong is the smell</legend>
  <label for="faint_input">Faint</label>
  <input id="faint_input" name="odor_strength" type="radio" />
  <label for="strong_input">Strong</label>
  <input id="strong_input" name="odor_strength" type="radio" />
  <label for="overwhelming_input">Overwhelming</label>
  <input id="overwhelming_input" name="odor_strength" type="radio" />

  <legend>Additional Comments</legend>
  <input id="comments_input" name="comments" type="text" />

  <button type="submit">Submit</button>
</form>