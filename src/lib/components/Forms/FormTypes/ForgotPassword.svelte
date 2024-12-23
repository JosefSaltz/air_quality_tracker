<script lang="ts">
</script>

<div class="sm:mx-auto w-full xl:w-auto sm:max-w-md">
  <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=&shade=600" alt="Your Company">
  <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Forgot Password</h2>
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

      <div class="flex items-center justify-right">
        <div class="text-sm/6">
          <a href="/" class="font-semibold text--600 hover:text--500">Back to Login</a>
        </div>
      </div>

      <div>
        <button type="submit" formaction="?/forgot_password" class="flex w-full justify-center rounded-md bg-stone-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg--500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline--600">Send email</button>
      </div>
    </form>
  </div>
</div>