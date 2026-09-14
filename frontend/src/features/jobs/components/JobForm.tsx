import { useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createJobSchema, type JobFormValues } from "../schemas/job-schema"
import type { Company } from "@/features/companies/api/companies-api"

interface JobFormProps {
  companies: Company[]
  initialValues?: Partial<JobFormValues>
  onSubmit: (values: JobFormValues) => Promise<void>
  isSubmitting?: boolean
  serverError?: string | null
  submitLabel: string
  lockCompany?: boolean
}
export function JobForm({
  companies,
  initialValues,
  onSubmit,
  isSubmitting,
  serverError,
  submitLabel,
  lockCompany = false,
}: JobFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(createJobSchema) as Resolver<JobFormValues>,
    defaultValues: { employmentType: "FULL_TIME", ...initialValues },
  })
  useEffect(() => {
    reset({ employmentType: "FULL_TIME", ...initialValues })
  }, [initialValues, reset])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
        >
          {serverError}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="companyId">Company</Label>
        <select
          id="companyId"
          disabled={lockCompany}
          className="h-8 w-full rounded-lg border bg-background px-2.5 text-sm"
          {...register("companyId", { setValueAs: (value) => Number(value) })}
        >
          <option value="">Select company</option>
          {companies.map((company) => (
            <option key={company.companyId} value={company.companyId}>
              {company.companyName}
            </option>
          ))}
        </select>
        {errors.companyId && <Error message={errors.companyId.message} />}
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Job title</Label>
        <Input
          id="title"
          placeholder="e.g. Frontend Developer"
          {...register("title")}
        />
        {errors.title && <Error message={errors.title.message} />}
      </div>
      <Field label="Job description">
        <Textarea
          rows={4}
          placeholder="Key responsibilities, requirements, or role details..."
          {...register("description")}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Location">
          <Input placeholder="Bengaluru, India" {...register("location")} />
        </Field>
        <Field label="Employment type">
          <select
            className="h-8 w-full rounded-lg border bg-background px-2.5 text-sm"
            {...register("employmentType")}
          >
            <option value="FULL_TIME">Full time</option>
            <option value="PART_TIME">Part time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Work arrangement">
          <select
            className="h-8 w-full rounded-lg border bg-background px-2.5 text-sm"
            {...register("workArrangement")}
          >
            <option value="">Not specified</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-site</option>
          </select>
        </Field>
        <Field label="Source">
          <Input placeholder="LinkedIn, referral..." {...register("source")} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Minimum salary">
          <Input
            type="number"
            min="0"
            {...register("salaryMin", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
        </Field>
        <Field label="Maximum salary">
          <Input
            type="number"
            min="0"
            {...register("salaryMax", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
        </Field>
        <Field label="Currency">
          <Input
            placeholder="INR"
            maxLength={3}
            {...register("salaryCurrency")}
          />
        </Field>
      </div>
      {errors.salaryMax && <Error message={errors.salaryMax.message} />}
      <Field label="Job URL">
        <Input type="url" placeholder="https://..." {...register("jobUrl")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Discovered date">
          <Input type="date" {...register("discoveredDate")} />
        </Field>
        <Field label="Closing date">
          <Input type="date" {...register("closingAt")} />
        </Field>
      </div>
      <Field label="Notes">
        <Textarea
          rows={3}
          placeholder="Useful details about the role..."
          {...register("notes")}
        />
      </Field>
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || companies.length === 0}
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}
function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
function Error({ message }: { message?: string }) {
  return <p className="text-sm text-destructive">{message}</p>
}
