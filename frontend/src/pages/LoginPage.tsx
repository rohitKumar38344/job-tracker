import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/features/auth/context/auth-context"
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"

function LoginPage() {
  const { login } = useAuth()
  const [loginError, setLoginError] = useState<string | null>(null)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    setLoginError(null)
    try {
      await login(data)
      navigate("/dashboard")
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message ?? "Unable to signin.")
      }
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/0 px-4">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your Job Tracker Account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {loginError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
                <p className="text-sm text-destructive">{loginError}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="you@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
