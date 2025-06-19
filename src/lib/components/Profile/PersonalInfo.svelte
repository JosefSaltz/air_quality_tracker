<script lang="ts">
  import Input from "$components/ui/input/input.svelte";

  type Props = {
    first_name: string | null,
    last_name: string | null,
    email: string
  }

  let { first_name, last_name, email }: Props = $props()
</script>

<div id="profile-info-section" class="w-full flex flex-col gap-4">
  <h2 class="text-xl">Personal Info</h2>
  <ul>
    <li>
      <label for="first-name">First name:</label>
      <Input type="text" name="first-name" placeholder={first_name ?? 'Add your first name'} />
    </li>
    <li>
      <label for="last-name">Last name:</label>
      <Input type="text" name="last-name" placeholder={last_name ?? "Add your last name"} />
    </li>
    <li>
      <label for="email">Email:</label>
      <Input type="email" name="email" placeholder={email} />
    </li>
  </ul>
</div>

<style>
  #profile-info-section li {
    display: flex;
  }
  label {
    width: 16ch;
  }
</style>