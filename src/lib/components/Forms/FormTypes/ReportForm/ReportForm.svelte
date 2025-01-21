<script lang="ts">
  import Button from "$components/ui/button/button.svelte";
  import Separator from "$components/ui/separator/separator.svelte";
  import { Title } from "$components/ui/card";
  import Card from "$components/ui/card/card.svelte";
  import OdorToggles from "@/lib/components/Forms/FormTypes/ReportForm/OdorToggles.svelte"
  import GasIcon from "@/lib/svg/gas.svelte";
  import SewageIcon from "@/lib/svg/sewage.svelte";
  import FormContainer from '@/lib/components/Forms/Layouts/FormContainer.svelte';
  import type { ActionData } from "../../../../../routes/$types";
  import { enhance } from "$app/forms";
  
  // import SmokeIcon from "@/lib/svg/smoke.svelte";
  let { form, currentGeolocation = $bindable() }: { form: ActionData} = $props();
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

  const handleSubmission = ({ formData }: { formData: FormData}) => {
    const {longitude, latitude } = currentGeolocation;
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
  }
  const styles = `border-top-left-radius: 0; border-bottom-left-radius: 0`;
</script>

<FormContainer>
  <Card class="p-10 justify-center w-xl">
    <Title class="mb-4 text-2xl">Log an Odor</Title>
    <form method="POST" use:enhance={handleSubmission}>

      <legend>Odor Type</legend>
      <OdorToggles selected={selectedOdor} toggles={odorTypes} />
      <Separator class="my-4" />

      <legend>How Strong is the Smell?</legend>
      <OdorToggles selected={selectedStrength} toggles={odorStrengths} />    
      <Separator class="my-4" />

      <legend>Additional Comments</legend>
      <input
        id="description"
        class="border w-full"
        name="description"
        type="text"
      />
      <Button class="block my-4" type="submit" formaction="?/report">Submit</Button>
    </form>
    {#if form?.error}<p class="error text-red-500">Something went wrong</p>{/if}
  </Card>
</FormContainer>

<style>
  legend {
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  input[type="text"] {
    resize: "vertical";
  }
</style>
