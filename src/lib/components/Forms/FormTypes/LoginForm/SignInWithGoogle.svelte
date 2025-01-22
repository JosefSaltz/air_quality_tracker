<script lang="ts">
  import { PUBLIC_GOOGLE_CLIENT_ID } from "$env/static/public";
</script>

<div id="g_id_onload"
     data-client_id={PUBLIC_GOOGLE_CLIENT_ID}
     data-context="signup"
     data-ux_mode="popup"
     data-callback="getLoginURI"
     data-auto_prompt="false">
</div>

<div class="g_id_signin"
     data-type="standard"
     data-shape="rectangular"
     data-theme="outline"
     data-text="signin_with"
     data-size="large"
     data-logo_alignment="left">
</div>