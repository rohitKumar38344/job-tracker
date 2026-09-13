import { useState } from "react"
import { Link, useNavigate } from "react-router"
import {
  Eye,
  EyeOff,
  Briefcase,
  Target,
  CalendarDays,
  BarChart3,
  Star,
  ArrowRight,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { register as registerUser } from "../api/auth-api"
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/register-schema"

export function RegisterPage() {
  const navigate = useNavigate()

  const [registerError, setRegisterError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormValues) {
    setRegisterError(null)

    try {
      await registerUser(data)

      navigate("/login")
    } catch (error) {
      setRegisterError(
        error instanceof Error
          ? error.message
          : "Unable to create your account."
      )
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-2xl border bg-background shadow-xl sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-5rem)]">
        {/* Left branding panel */}
        <section className="relative hidden w-[42%] overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col">
          {/* Decorative background */}
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />

          {/* Brand */}
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
              <Briefcase className="h-5 w-5" />
            </div>

            <div>
              <p className="font-semibold tracking-tight">JobTracker</p>
              <p className="text-xs text-slate-400">
                Your career journey, organized.
              </p>
            </div>
          </div>

          {/* Main message */}
          <div className="relative mt-20">
            <p className="mb-4 text-sm font-medium tracking-[0.2em] text-indigo-300 uppercase">
              Your career, organized
            </p>

            <h1 className="max-w-md text-4xl font-bold tracking-tight xl:text-5xl">
              Track.
              <br />
              Apply.
              <br />
              Grow.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
              Keep track of your job applications, manage interviews, and stay
              focused on landing your next opportunity.
            </p>
          </div>

          {/* Features */}
          <div className="relative mt-12 space-y-6">
            <Feature
              icon={<Target className="h-5 w-5" />}
              title="Organize your applications"
              description="Never lose track of opportunities."
            />

            <Feature
              icon={<CalendarDays className="h-5 w-5" />}
              title="Manage interviews"
              description="Stay prepared and on schedule."
            />

            <Feature
              icon={<BarChart3 className="h-5 w-5" />}
              title="Track your progress"
              description="See your job search at a glance."
            />

            <Feature
              icon={<Star className="h-5 w-5" />}
              title="Achieve your goals"
              description="Turn opportunities into success."
            />
          </div>

          {/* Bottom message */}
          <div className="relative mt-auto pt-10">
            <p className="text-2xl font-medium text-indigo-300 italic">
              A better career
              <br />
              starts here.
            </p>
          </div>
        </section>

        {/* Registration form */}
        <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <Card className="w-full max-w-lg border-0 shadow-none">
            <CardHeader className="px-0">
              <p className="text-sm font-medium text-muted-foreground">
                Welcome to JobTracker
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Start organizing your job search and keep every opportunity in
                one place.
              </p>
            </CardHeader>

            <CardContent className="px-0">
              {registerError && (
                <div
                  role="alert"
                  className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {registerError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>

                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    {...register("name")}
                  />

                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register("email")}
                  />

                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      className="pr-11"
                      {...register("password")}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}

                  <div className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      Your password must:
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>Be at least 8 characters long</li>
                      <li>Be no more than 128 characters</li>
                    </ul>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full"
                >
                  {isSubmitting ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Login link */}
              <div className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </div>

              {/* Terms */}
              <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">
                By creating an account, you agree to our{" "}
                <span className="text-primary">Terms of Service</span> and{" "}
                <span className="text-primary">Privacy Policy</span>.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-indigo-300">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  )
}
