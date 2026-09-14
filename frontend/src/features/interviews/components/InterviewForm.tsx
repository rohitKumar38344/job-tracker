import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { interviewTypes, type InterviewInput } from "../api/interviews-api"
export function InterviewForm({
  onSubmit,
  isSubmitting,
  error,
}: {
  onSubmit: (input: InterviewInput) => Promise<void>
  isSubmitting: boolean
  error?: string | null
}) {
  const { register, handleSubmit } = useForm<InterviewInput>({
    defaultValues: { interviewType: "TECHNICAL", durationMinutes: 60 },
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
        <Label>Interview type</Label>
        <select
          className="h-8 w-full rounded-lg border bg-background px-2.5 text-sm"
          {...register("interviewType")}
        >
          {interviewTypes.map((type) => (
            <option key={type} value={type}>
              {type.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Date and time</Label>
          <Input type="datetime-local" {...register("scheduledAt")} />
        </div>
        <div className="space-y-2">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            min="1"
            {...register("durationMinutes", {
              setValueAs: (value) => Number(value),
            })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Interviewer</Label>
        <Input {...register("interviewer")} />
      </div>
      <div className="space-y-2">
        <Label>Meeting link</Label>
        <Input
          type="url"
          placeholder="https://..."
          {...register("meetingLink")}
        />
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          placeholder="Online or office address"
          {...register("location")}
        />
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea rows={3} {...register("notes")} />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Schedule interview"}
      </Button>
    </form>
  )
}
