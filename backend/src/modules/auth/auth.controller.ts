import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "./auth.validation";
import { registerUser, loginUser } from "./auth.service";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const user = await registerUser(result.data);
    res.status(201).json({ data: user });
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({
        message: "Invalid request body",
        errors: result.error.flatten().fieldErrors,
      });
  }

  try {
    const resultData = await loginUser(result.data);
    return res.status(200).json({ data: resultData });
  } catch (error) {
    return next(error);
  }
}
