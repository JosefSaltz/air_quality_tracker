<script lang="ts">
  import Button from "../../ui/button/button.svelte";
  import Card from "../../ui/card/card.svelte";
  import FormContainer from "../Layouts/FormContainer.svelte";
</script>

<FormContainer>
  <Card>
    <div class="flex flex-col justify-center items-center h-full w-100 xl:min-w-72 py-[50%]">
      <p>Please login before posting</p>
      <Button class="my-5" href="/auth/login">Login</Button>
      <p>
        Need an account? 
        <a href="/auth/signup" class="hover:text-sky-700">Click Here</a>
      </p>
    </div>
  </Card>
</FormContainer>