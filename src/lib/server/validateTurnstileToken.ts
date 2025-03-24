import { PRIVATE_TURNSTILE_SECRET } from "$env/static/private"

export async function validateTurnstileToken(formData: FormData, ip: string) {
  console.log(`🔍 Validating Turnstile Token...`)
  // Turnstile injects a token in "cf-turnstile-response".
  const captchaToken = formData.get("cf-turnstile-response") as string | undefined | null;
  if(!captchaToken) return {status: `Unable to retrieve token from request`, captchaToken };
  if(!ip) return {status: `Unable to retrieve required headers for request`, captchaToken };
  // Validate the token by calling the
  // "siteverify" API endpoint.
  let sendFormData = new FormData();
  sendFormData.append("secret", PRIVATE_TURNSTILE_SECRET);
  sendFormData.append("response", captchaToken);
  sendFormData.append("remoteip", ip);
  // Server side validate the token from our request
  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const response = await fetch(url, {
    body: sendFormData,
    method: "POST",
  });
  // Handle the response accordingly
  const outcome = await response.json();
  if (outcome.success) {
    return { status: `succeeded`, captchaToken }
  }
  else {
    return { status: "failed", captchaToken}
  };
}