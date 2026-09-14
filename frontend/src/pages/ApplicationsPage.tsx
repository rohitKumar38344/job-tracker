import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ApplicationForm } from "@/features/applications/components/ApplicationForm"
import {
  applicationStatuses,
  type Application,
  type ApplicationInput,
  type ApplicationStatus,
} from "@/features/applications/api/applications-api"
import {
  useApplications,
  useCreateApplication,
  useDeleteApplication,
  useUpdateApplication,
} from "@/features/applications/hooks/use-applications"
import { useJobs } from "@/features/jobs/hooks/use-jobs"

const statusLabel = (status: string) =>
  status.charAt(0) + status.slice(1).toLowerCase()
export default function ApplicationsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [filter, setFilter] = useState<ApplicationStatus | undefined>()
  const {
    data: applications = [],
    isPending,
    isError,
  } = useApplications(filter)
  const { data: jobsData } = useJobs()
  const create = useCreateApplication()
  const update = useUpdateApplication()
  const remove = useDeleteApplication()
  async function submit(input: ApplicationInput) {
    await create.mutateAsync(input)
    setCreateOpen(false)
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Applications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Follow every application from submission to outcome.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add application
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={!filter ? "default" : "outline"}
          onClick={() => setFilter(undefined)}
        >
          All
        </Button>
        {applicationStatuses.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
          >
            {statusLabel(status)}
          </Button>
        ))}
      </div>
      {isPending && (
        <p className="text-sm text-muted-foreground">Loading applications...</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">Unable to load applications.</p>
      )}
      {!isPending && !isError && applications.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h2 className="font-semibold">No applications yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create an application from one of your saved jobs.
          </p>
        </div>
      )}
      <div className="grid gap-3">
        {applications.map((application) => (
          <ApplicationCard
            key={application.applicationId}
            application={application}
            onStatus={(status) =>
              update.mutate({
                applicationId: application.applicationId,
                input: { currentStatus: status },
              })
            }
            onDelete={() => remove.mutate(application.applicationId)}
          />
        ))}
      </div>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add application</DialogTitle>
            <DialogDescription>
              Select a saved job and record your application details.
            </DialogDescription>
          </DialogHeader>
          <ApplicationForm
            jobs={jobsData?.jobs ?? []}
            onSubmit={submit}
            isSubmitting={create.isPending}
            error={create.error instanceof Error ? create.error.message : null}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
function ApplicationCard({
  application,
  onStatus,
  onDelete,
}: {
  application: Application
  onStatus: (status: ApplicationStatus) => void
  onDelete: () => void
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold">{application.jobTitle}</h2>
            <Badge variant="secondary">
              {statusLabel(application.currentStatus)}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {application.companyName} · Applied{" "}
            {new Date(application.applicationDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Application status"
            className="h-8 rounded-lg border bg-background px-2 text-sm"
            value={application.currentStatus}
            onChange={(event) =>
              onStatus(event.target.value as ApplicationStatus)
            }
          >
            {applicationStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={onDelete}
            aria-label={`Delete ${application.jobTitle}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
