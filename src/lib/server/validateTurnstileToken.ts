import type { RequestEvent } from "../../routes/auth/login/$types";
import { PRIVATE_TURNSTILE_SECRET } from "$env/static/private"

export async function validateTurnstileToken(request : Request) {
  const body = await request.formData();
  // Turnstile injects a token in "cf-turnstile-response".
  const token = body.get("cf-turnstile-response");
  const ip = request.headers.get("CF-Connecting-IP");
  if(!token) return console.error(`Unable to retrieve token from request`);
  if(!ip) return console.error(`Unable to retrieve required headers for request`);
  // Validate the token by calling the
  // "/siteverify" API endpoint.
  let formData = new FormData();
  formData.append("secret", PRIVATE_TURNSTILE_SECRET);
  formData.append("response", token);
  formData.append("remoteip", ip);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });

  const outcome = await result.json();
  if (outcome.success) {
    return { status: `valid`, token }
  }
}