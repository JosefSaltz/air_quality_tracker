<script lang="ts" module>
  import Button from "$components/ui/button/button.svelte";
  import Separator from "$components/ui/separator/separator.svelte";
  import { Title } from "$components/ui/card";
  import OdorToggles from "$components/ReportForm/OdorToggles.svelte"
  import GasIcon from "@/lib/svg/gas.svelte";
  import SewageIcon from "@/lib/svg/sewage.svelte";
  import FormContainer from '@/lib/components/Forms/Layouts/FormContainer.svelte';
  // import SmokeIcon from "@/lib/svg/smoke.svelte";
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
    // { name: "Smoke", icon: SmokeIcon },
  ];
  
  const styles = `border-top-left-radius: 0; border-bottom-left-radius: 0`;
</script>


<FormContainer>
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
    <Button class="block mt-4" type="submit" onClick={handleSubmit}>Submit</Button>
  </form>
</FormContainer>

<style>
  legend {
    font-weight: 700;
    margin-bottom: 1rem;
  }
  input[type="text"] {
    resize: "vertical";
  }

  #report-form-container {
    border-left: none;
  }
</style>
