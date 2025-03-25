import { fail } from "@sveltejs/kit";
import type { RequestEvent } from "../../routes/auth/signup/$types";
import { z } from "zod";

export async function readEmailAuthRequest(request: RequestEvent["request"]) {
  try {
    // Assign relevant request header names
    const cfTokenKey = 'cf-turnstile-response';
    const cfConnectingIP = 'cf-connecting-ip';
    // Retrieve formData
    const formData = await request.formData()
    // Get the client's turnstile response
    const turnstileResponse = formData.get(cfTokenKey) as string | null;
    if(!turnstileResponse) throw Error(`❌ Failed to read ${cfTokenKey}: ${turnstileResponse}`);
    // Get client's connecting IP when doing challenge
    const turnstileIP = request.headers.get(cfConnectingIP) as string | null ||
    request.headers.get("x-forwarded-for") as string | null;
    if(!turnstileIP) throw Error(`❌ Failed to read ${cfConnectingIP}: ${turnstileIP}`);
    // Get relevant signup form data
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    if(!email || !password) throw Error(`❌ Failed to read username or password`);
    // Validation check that will throw errors if anything is wrong
    validateEmailAndPassword(email, password);
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

function validateEmailAndPassword(email: string, password: string) {
  // Zod Validation Schemas
  const validEmail = z.string().email();
  const validPassword = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one digit")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
  const validatedEmail = validEmail.safeParse(email);
  const validatedPassword = validPassword.safeParse(password);
  if(validatedEmail.error) throw Error(`❌ Invalid Email Format`);
  if(validatedPassword.error) throw Error(`❌ Invalid Password Format`);
}