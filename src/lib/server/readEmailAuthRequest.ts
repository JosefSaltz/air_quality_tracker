import { fail } from "@sveltejs/kit";
import type { RequestEvent } from "../../routes/auth/signup/$types";
import { validateEmailAndPassword } from "../utils/validateEmailAndPassword";

export async function readEmailAuthRequest(request: RequestEvent["request"]) {
  console.log(`Reading Headers...`)
  console.table(request.headers)
  try {
    // Assign relevant request header names
    const cfTokenKey = "cf-turnstile-response";
    const cfConnectingIP = "CF-Connecting-IP";
    // Retrieve formData
    const formData = await request.formData()
    // Get the client's turnstile response
    const turnstileResponse = formData.get(cfTokenKey) as string | null;
    if(!turnstileResponse) throw Error(`❌ Failed to read ${cfTokenKey}: ${turnstileResponse}`);
    // Get client's connecting IP when doing challenge
    const turnstileIP = request.headers.get(cfConnectingIP) as string | null ||
    request.headers.get("x-forwarded-for") as string | null;
    if(!turnstileIP) console.warn(`⚠️ Failed to read ${cfConnectingIP}: ${turnstileIP}`);
    // Get relevant signup form data
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    if(!email || !password) throw Error(`❌ Failed to read username or password`);
    // Get optional payload items in the event this is a sign up request
    const first_name = formData.get("email") as string | null;
    const last_name = formData.get("password") as string | null;
    // Return our relevant signup data
    return { turnstileIP, turnstileResponse, email, password, first_name, last_name };
  }
  catch(err) {
    if(err instanceof Error) console.error(err);
    if(err instanceof String) console.error(err);
    return fail(400)
  }
}