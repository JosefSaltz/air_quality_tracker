<script lang="ts">
  import Button from "$components/ui/button/button.svelte";
  import { Title } from "$components/ui/card";
  import Card from "$components/ui/card/card.svelte";
  import FormContainer from "@/lib/components/Forms/Layouts/FormDrawer.svelte";
</script>


<Card class="py-[50%]">
  <div class="flex flex-col justify-center items-center h-full w-100 xl:min-w-72 ">
    <p>Please login before posting</p>
    <Button class="my-5" href="/auth/login">Login</Button>
    <p>
      Need an account? 
      <a href="/auth/signup" class="hover:text-sky-700">Click Here</a>
    </p>
  </div>
</Card>
