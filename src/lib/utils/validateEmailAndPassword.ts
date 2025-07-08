
import { validEmailSchema, validPasswordSchema } from "$zSchemas";

export function validateEmailAndPassword(email: string, password: string) {
  // Parse Data
  const validatedEmail = validEmailSchema.safeParse(email);
  const validatedPassword = validPasswordSchema.safeParse(password);
  // Throw errors if anything fails
  if(validatedEmail.error) throw Error(`❌ Invalid Email Format`);
  if(validatedPassword.error) throw Error(`❌ Invalid Password Format`);
  console.log(`✅ Password Validated`);
  return true;
}