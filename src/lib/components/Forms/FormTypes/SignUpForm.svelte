<script lang="ts">
  import FormContainer from "@/lib/components/Forms/Layouts/FormContainer.svelte";
</script>

<FormContainer>
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=&shade=600" alt="Your Company">
    <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign Up</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
    <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
      <form class="space-y-6" action="#" method="POST">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <input type="email" name="email" id="email" autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
          <div class="mt-2">
            <input type="password" name="password" id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex gap-3">
            <div class="flex h-6 shrink-0 items-center">
              <div class="group grid size-4 grid-cols-1">
                <input id="remember-me" name="remember-me" type="checkbox" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border--600 checked:bg--600 indeterminate:border--600 indeterminate:bg--600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline--600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto">
                <svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
                  <path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
            <label for="remember-me" class="block text-sm/6 text-gray-900">Remember me</label>
          </div>
        </div>

        <div>
          <button type="submit" formaction="?/signup" class="flex w-full justify-center rounded-md bg--600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg--500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline--600">Sign up</button>
        </div>
      </form>

    <p class="mt-10 text-center text-sm/6 text-gray-500">
      Already have an account?
      <a href="/?auth=login" class="font-semibold text--600 hover:text--500">Login Here</a>
    </p>
  </div>
</FormContainer>