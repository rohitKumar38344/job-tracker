import { ZodError } from "zod";

export default function formatZodError(error: ZodError){
  return error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
}))
}