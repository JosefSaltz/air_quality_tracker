<script lang="ts">
  import '@hcaptcha/vanilla-hcaptcha';
  import { PUBLIC_HCAPTCHA_SITE_KEY } from "$env/static/public"
  import { onMount } from "svelte";

  onMount(() => {
    const signupCaptcha = document.getElementById('signupCaptcha');
    if(!signupCaptcha) return console.error(`Something went wrong setting up captcha`);
    signupCaptcha.addEventListener('verified', (e: Event & { token: string }) => {
      console.log('verified event', { token: e.token });
    });
  })
</script>
<h-captcha 
  id="signupCaptcha"
  site-key={PUBLIC_HCAPTCHA_SITE_KEY}
  size="normal"
  theme="dark"
>
</h-captcha>