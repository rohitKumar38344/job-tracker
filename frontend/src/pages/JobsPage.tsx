import { useState } from "react"
import { BriefcaseBusiness, Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useCreateJob,
  useDeleteJob,
  useJobs,
  useUpdateJob,
} from "@/features/jobs/hooks/use-jobs"
import { JobCard } from "@/features/jobs/components/job-card"
import { JobForm } from "@/features/jobs/components/JobForm"
import { useCompanies } from "@/features/companies/hooks/use-companies"
import type { JobFormValues } from "@/features/jobs/schemas/job-schema"
import type { Job } from "@/features/jobs/types/job"

export default function JobsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const { data, isPending, isError, refetch } = useJobs()
  const { data: companiesResponse } = useCompanies()
  const createJob = useCreateJob()
  const updateJob = useUpdateJob()
  const deleteJob = useDeleteJob()
  const jobs = data?.jobs ?? []
  const companies = companiesResponse?.data ?? []
  async function handleCreate(values: JobFormValues) {
    await createJob.mutateAsync(values)
    setCreateOpen(false)
  }
  async function handleUpdate(values: JobFormValues) {
    if (!editingJob) return
    const { companyId: _companyId, ...input } = values
    await updateJob.mutateAsync({ jobId: editingJob.jobId, input })
    setEditingJob(null)
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage the jobs you’re interested in.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add job
        </Button>
      </div>
      <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-5">
        <div className="flex size-12 items-center justify-center rounded-xl bg-background shadow-sm">
          <BriefcaseBusiness className="size-6" />
        </div>
        <div>
          <p className="font-semibold">
            {data?.pagination.total ?? 0} saved jobs
          </p>
          <p className="text-sm text-muted-foreground">
            Keep opportunities organized and ready to act on.
          </p>
        </div>
      </div>
      {isPending && (
        <p className="text-sm text-muted-foreground">Loading jobs...</p>
      )}
      {isError && (
        <div className="rounded-xl border border-destructive/30 p-6 text-center">
          <p className="text-sm text-destructive">Unable to load jobs.</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            <RefreshCw className="mr-2 size-4" />
            Try again
          </Button>
        </div>
      )}
      {!isPending && !isError && jobs.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h2 className="font-semibold">No jobs yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a company first, then save the job opportunities you find.
          </p>
        </div>
      )}
      <div className="space-y-3">
        {jobs.map((job) => (
          <JobCard
            key={job.jobId}
            job={job}
            onView={() => setSelectedJob(job)}
            onEdit={() => setEditingJob(job)}
            onDelete={() => deleteJob.mutate(job.jobId)}
          />
        ))}
      </div>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add job</DialogTitle>
            <DialogDescription>
              Save an opportunity before creating its application.
            </DialogDescription>
          </DialogHeader>
          <JobForm
            companies={companies}
            onSubmit={handleCreate}
            isSubmitting={createJob.isPending}
            serverError={
              createJob.error instanceof Error ? createJob.error.message : null
            }
            submitLabel="Create job"
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={editingJob !== null}
        onOpenChange={(open) => !open && setEditingJob(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit job</DialogTitle>
            <DialogDescription>
              Update the saved information for this opportunity.
            </DialogDescription>
          </DialogHeader>
          {editingJob && (
            <JobForm
              key={editingJob.jobId}
              companies={companies}
              initialValues={jobValues(editingJob)}
              lockCompany
              onSubmit={handleUpdate}
              isSubmitting={updateJob.isPending}
              serverError={
                updateJob.error instanceof Error
                  ? updateJob.error.message
                  : null
              }
              submitLabel="Save changes"
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={selectedJob !== null}
        onOpenChange={(open) => !open && setSelectedJob(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
            <DialogDescription>{selectedJob?.companyName}</DialogDescription>
          </DialogHeader>
          {selectedJob && <JobDetails job={selectedJob} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
function jobValues(job: Job): JobFormValues {
  return {
    companyId: job.companyId,
    title: job.title,
    description: job.description ?? undefined,
    location: job.location ?? undefined,
    employmentType: job.employmentType,
    workArrangement: job.workArrangement ?? undefined,
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    salaryCurrency: job.salaryCurrency ?? undefined,
    jobUrl: job.jobUrl ?? undefined,
    source: job.source ?? undefined,
    notes: job.notes ?? undefined,
  }
}
function JobDetails({ job }: { job: Job }) {
  const rows = [
    ["Location", job.location],
    ["Arrangement", job.workArrangement?.replaceAll("_", " ")],
    ["Employment", job.employmentType.replaceAll("_", " ")],
    [
      "Salary",
      job.salaryMin !== null || job.salaryMax !== null
        ? `${job.salaryCurrency ?? ""} ${job.salaryMin?.toLocaleString() ?? ""} ${job.salaryMax ? `– ${job.salaryMax.toLocaleString()}` : ""}`
        : null,
    ],
    ["Source", job.source],
    ["Discovered", job.discoveredDate?.slice(0, 10)],
    ["Closing", job.closingAt?.slice(0, 10)],
  ]
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
          {rows
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-medium text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 text-sm">{value}</p>
              </div>
            ))}
        </CardContent>
      </Card>
      {job.description && (
        <Section title="Description">{job.description}</Section>
      )}
      {job.notes && <Section title="Notes">{job.notes}</Section>}
      {job.jobUrl && (
        <a
          href={job.jobUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-primary hover:underline"
        >
          Open job posting
        </a>
      )}
    </div>
  )
}
function Section({ title, children }: { title: string; children: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm whitespace-pre-wrap text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  )
}
