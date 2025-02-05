<script lang="ts">
  import { SignUpForm } from "$components/Forms/FormTypes";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
  const { googleNonce } = data;
</script>

<SignUpForm googleNonce={googleNonce} />