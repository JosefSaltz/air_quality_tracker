<script lang="ts">
  import Button from "$components/ui/button/button.svelte";
  import Separator from "$components/ui/separator/separator.svelte";
  import { Title } from "$components/ui/card";
  import OdorToggles from "@/lib/components/Forms/FormTypes/ReportForm/OdorToggles.svelte"
  import GasIcon from "@/lib/assets/svg/gas.svelte";
  import SewageIcon from "@/lib/assets/svg/sewage.svelte";
  import { enhance } from "$app/forms";
  import type { ActionData, PageProps, SubmitFunction } from "../../../../../routes/$types";
  import type { GeoCoords } from "@/lib/components/ReportMap/ReportMap.svelte";
  import { invalidate } from "$app/navigation";
  import { resolveRoute } from "$app/paths";
  import type { ActionResult } from "@sveltejs/kit";

  type Props = {
    form: ActionData,
    currentGeolocation: GeoCoords,
    drawerIsOpen: boolean
  }
  // import SmokeIcon from "@/lib/svg/smoke.svelte";
  let { form, currentGeolocation = $bindable(), drawerIsOpen = $bindable() }: Props = $props();
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
  // Time Picker State
  // let period: Period = $state(null);
  // let selectedDate: Date | null = $state(null);
  const handleSubmission: SubmitFunction = ({ formData }) => {
    if(!selectedStrength) return console.error('No strength chosen!');
    const first_name = formData.get('first_name');
    const last_name = formData.get('last_name');
    // Only assign full_name if first_name and last_name are present
    const full_name = first_name && last_name ? `${first_name} ${last_name}`: null;
    const { latitude, longitude } = currentGeolocation;
    const appended = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      location: `POINT(${longitude} ${latitude})`,
      strength: selectedStrength,
      full_name
    }
    for (const [key, value] of Object.entries(appended)) {
      formData.append(key, value ?? 'null')
    }
    drawerIsOpen = false;
    return async ({ result, update }) => {
      await update()
    }
  }

  const styles = `border-top-left-radius: 0; border-bottom-left-radius: 0`;
</script>

<div id="form-layout" class="flex flex-col justify-center items-center w-full">
  <div class="p-10 w-full max-w-xl">
    <Title class="mb-4 text-2xl">Report an Odor</Title>
    <form method="POST" use:enhance={handleSubmission}>

      <legend>Odor Type</legend>
      <OdorToggles selected={selectedOdor} toggles={odorTypes} />
      <Separator class="my-4" />

      <legend>How Strong is the Smell?</legend>
      <OdorToggles bind:selected={selectedStrength} toggles={odorStrengths} />    
      
      <!-- <legend>Duration</legend>
      <TimePickerInput picker="12hours"
        period={period}
        date={date}
        setDate={(val) => { selectedDate(val) }}
        ref={hourRef}
        onRightFocus={() => minuteRef.current?.focus()} 
      />
      <Separator class="my-4" /> -->

      <legend class="mt-4">Additional Comments</legend>
      <textarea
        id="description"
        class="border w-full max-h-12"
        name="description"
      ></textarea>
      <Button class="block my-4" type="submit" formaction="?/report">Submit</Button>
    </form>
  </div>
</div>

<style>
  legend {
    font-weight: 700;
    margin-bottom: 1rem;
  }
</style>
