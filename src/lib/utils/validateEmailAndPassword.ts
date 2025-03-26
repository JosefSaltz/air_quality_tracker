import { z } from "zod";
import { validPassword } from "./zSchemas/validPassword";

export function validateEmailAndPassword(email: string, password: string) {
  // Zod Validation Schemas
  const validEmail = z.string().email();
  // Parse Data
  const validatedEmail = validEmail.safeParse(email);
  const validatedPassword = validPassword.safeParse(password);
  // Throw errors if anything fails
  if(validatedEmail.error) throw Error(`❌ Invalid Email Format`);
  if(validatedPassword.error) throw Error(`❌ Invalid Password Format`);
  console.log(`✅ Password Validated`);
  return true;
}