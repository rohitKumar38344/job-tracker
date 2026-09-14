import { useMemo, useState } from "react"
import { useQueries } from "@tanstack/react-query"
import { CalendarDays, ExternalLink, Plus, Trash2 } from "lucide-react"
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
import { useApplications } from "@/features/applications/hooks/use-applications"
import {
  getInterviews,
  interviewResults,
  type InterviewInput,
  type InterviewResult,
} from "@/features/interviews/api/interviews-api"
import {
  useCreateInterview,
  useDeleteInterview,
  useUpdateInterview,
} from "@/features/interviews/hooks/use-interviews"
import { InterviewForm } from "@/features/interviews/components/InterviewForm"

export default function InterviewsPage() {
  const [selectedApplication, setSelectedApplication] = useState<number | null>(
    null
  )
  const { data: applications = [], isPending } = useApplications()
  const queries = useQueries({
    queries: applications.map((application) => ({
      queryKey: ["interviews", application.applicationId],
      queryFn: () => getInterviews(application.applicationId),
    })),
  })
  const interviews = useMemo(
    () =>
      queries
        .flatMap((query) => query.data ?? [])
        .sort(
          (left, right) =>
            new Date(left.scheduledAt).getTime() -
            new Date(right.scheduledAt).getTime()
        ),
    [queries]
  )
  const create = useCreateInterview()
  const update = useUpdateInterview()
  const remove = useDeleteInterview()
  async function submit(input: InterviewInput) {
    if (!selectedApplication) return
    await create.mutateAsync({ applicationId: selectedApplication, input })
    setSelectedApplication(null)
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Interviews</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Schedule interviews and record their outcomes.
          </p>
        </div>
        <Button
          onClick={() =>
            setSelectedApplication(applications[0]?.applicationId ?? null)
          }
          disabled={!applications.length}
        >
          <Plus className="mr-2 size-4" />
          Schedule interview
        </Button>
      </div>
      {isPending && (
        <p className="text-sm text-muted-foreground">Loading interviews...</p>
      )}
      {!isPending && interviews.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <CalendarDays className="mx-auto size-6 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">No interviews scheduled</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create an application first, then schedule its interview.
          </p>
        </div>
      )}
      <div className="grid gap-3">
        {interviews.map((interview) => (
          <Card key={interview.interviewId}>
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{interview.jobTitle}</h2>
                  <Badge variant="secondary">
                    {interview.interviewType.replaceAll("_", " ")}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {interview.companyName} ·{" "}
                  {new Date(interview.scheduledAt).toLocaleString()} ·{" "}
                  {interview.durationMinutes} min
                </p>
                {interview.interviewer && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    With {interview.interviewer}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Interview result"
                  className="h-8 rounded-lg border bg-background px-2 text-sm"
                  value={interview.result}
                  onChange={(event) =>
                    update.mutate({
                      interviewId: interview.interviewId,
                      input: { result: event.target.value as InterviewResult },
                    })
                  }
                >
                  {interviewResults.map((result) => (
                    <option key={result} value={result}>
                      {result.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
                {interview.meetingLink && (
                  <a
                    className="rounded-lg p-2 hover:bg-muted"
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open meeting link"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => remove.mutate(interview.interviewId)}
                  aria-label="Delete interview"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog
        open={selectedApplication !== null}
        onOpenChange={(open) => !open && setSelectedApplication(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule interview</DialogTitle>
            <DialogDescription>
              Choose the application, then add the interview details.
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <>
              <select
                className="h-8 w-full rounded-lg border bg-background px-2.5 text-sm"
                value={selectedApplication}
                onChange={(event) =>
                  setSelectedApplication(Number(event.target.value))
                }
              >
                {applications.map((application) => (
                  <option
                    key={application.applicationId}
                    value={application.applicationId}
                  >
                    {application.jobTitle} — {application.companyName}
                  </option>
                ))}
              </select>
              <InterviewForm
                onSubmit={submit}
                isSubmitting={create.isPending}
                error={
                  create.error instanceof Error ? create.error.message : null
                }
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
