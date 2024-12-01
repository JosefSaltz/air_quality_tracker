<script lang="ts" module>
  import supabase from "@/lib/utils/client";
  import type { Actions } from "@sveltejs/kit";
  import Button from "../ui/button/button.svelte";
  import Card from "../ui/card/card.svelte";
  import Separator from "../ui/separator/separator.svelte";
  import { Title } from "../ui/card";
  import OdorToggles from "./OdorToggles.svelte"
  import GasIcon from "@/lib/svg/gas.svelte";
  import SewageIcon from "@/lib/svg/sewage.svelte";
  import SmokeIcon from "@/lib/svg/smoke.svelte";

  let selectedOdor: null | 'Gas' | "Sewage" | "Smoke" = $state(null);
  let selectedStrength: null | 'Faint' | "Strong" | 'Overwhelming' = $state(null);

  const odorStrengths = [
    { name: "Faint", icon: "😒" },
    { name: "Strong", icon: "😖" },
    { name: "Overwhelming", icon: "🤢" },
  ];

  const odorTypes = [
    { name: "Gas", icon: GasIcon },
    { name: "Sewage", icon: SewageIcon },
    { name: "Smoke", icon: SmokeIcon },
  ];
  // const supabase = createClient(process.env.SUPABASE_PROJECT_URL);
  export const actions = {
    default: async (event) => {
      const payload = { odor_type: selectedOdor, odor_strength: selectedStrength }
      // Add validation before insert
      // Add the insert action
      // supabase.from().insert()
    },
  } satisfies Actions;
</script>

<Card class="p-10 min-w-max">
  <Title class="mb-4 text-2xl">Report an Odor</Title>
  <form method="POST">

    <legend>Odor Type</legend>
    <OdorToggles selected={selectedOdor} toggles={odorTypes} />
    <Separator class="my-4" />

    <legend>How Strong is the Smell?</legend>
    <OdorToggles selected={selectedStrength} toggles={odorStrengths} />    
    <Separator class="my-4" />

    <legend>Additional Comments</legend>
    <input
      id="comments_input"
      class="border w-full"
      name="comments"
      type="text"
    />
    <Button class="block mt-4" type="submit">Submit</Button>
  </form>
</Card>

<style>
  legend {
    font-weight: 700;
    margin-bottom: 1rem;
  }
</style>
