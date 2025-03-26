import { PRIVATE_TURNSTILE_SECRET } from "$env/static/private"

export async function validateTurnstileToken(turnstileResponse: string, ip?: string | null) {
  console.log(`🔍 Validating Turnstile Token...`)
  // Validate the token by calling the
  // "siteverify" API endpoint.
  let sendFormData = new FormData();
  sendFormData.append("secret", PRIVATE_TURNSTILE_SECRET);
  sendFormData.append("response", turnstileResponse);
  ip && sendFormData.append("remoteip", ip);
  // Server side validate the token from our request
  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const response = await fetch(url, {
    body: sendFormData,
    method: "POST",
  });
  // Handle the response accordingly
  const outcome = await response.json();
  if (outcome.success) {
    return true
  }
  else {
    return false
  };
}