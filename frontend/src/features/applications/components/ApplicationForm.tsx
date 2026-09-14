import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Job } from "@/features/jobs/types/job"
import type { ApplicationInput } from "../api/applications-api"
export function ApplicationForm({
  jobs,
  onSubmit,
  isSubmitting,
  error,
}: {
  jobs: Job[]
  onSubmit: (input: ApplicationInput) => Promise<void>
  isSubmitting: boolean
  error?: string | null
}) {
  const { register, handleSubmit } = useForm<ApplicationInput>({
    defaultValues: {
      applicationDate: new Date().toISOString().slice(0, 10),
      coverLetterUsed: false,
    },
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <div className="space-y-2">
        <Label>Job</Label>
        <select
          className="h-8 w-full rounded-lg border bg-background px-2.5 text-sm"
          {...register("jobId", { setValueAs: (value) => Number(value) })}
        >
          <option value="">Select a job</option>
          {jobs.map((job) => (
            <option key={job.jobId} value={job.jobId}>
              {job.title} — {job.companyName}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label>Application date</Label>
        <Input type="date" {...register("applicationDate")} />
      </div>
      <div className="space-y-2">
        <Label>Resume name</Label>
        <Input placeholder="Resume-v2.pdf" {...register("resumeName")} />
      </div>
      <div className="space-y-2">
        <Label>Referral source</Label>
        <Input
          placeholder="LinkedIn, recruiter, referral..."
          {...register("referralSource")}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("coverLetterUsed")} /> Cover letter
        used
      </label>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea rows={3} {...register("notes")} />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || jobs.length === 0}
      >
        {isSubmitting ? "Saving..." : "Create application"}
      </Button>
    </form>
  )
}
