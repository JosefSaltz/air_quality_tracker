import { z } from "zod";

export const validEmailSchema = z.string().email();