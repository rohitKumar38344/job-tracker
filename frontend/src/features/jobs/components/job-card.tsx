import { BriefcaseBusiness, CalendarDays, Eye, MapPin, Monitor, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Job } from "../types/job"

interface JobCardProps { job: Job; onView: () => void; onEdit: () => void; onDelete: () => void }
export function JobCard({ job, onView, onEdit, onDelete }: JobCardProps) {
  const salary = job.salaryMin !== null || job.salaryMax !== null ? `${job.salaryCurrency ?? ""} ${job.salaryMin?.toLocaleString() ?? ""}${job.salaryMax !== null ? ` – ${job.salaryMax?.toLocaleString()}` : "+"}` : null
  const date = job.createdAt ? new Date(job.createdAt) : null
  return <Card className="transition-shadow hover:shadow-sm"><CardContent className="flex items-center gap-5 p-5"><div className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-muted/30"><BriefcaseBusiness className="size-5 text-muted-foreground" /></div><div className="min-w-0 flex-1"><h2 className="truncate font-semibold">{job.title}</h2><p className="mt-1 text-sm text-muted-foreground">{job.companyName}</p><div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">{job.location && <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{job.location}</span>}{job.workArrangement && <span className="inline-flex items-center gap-1"><Monitor className="size-4" />{job.workArrangement}</span>}<span>{job.employmentType.replaceAll("_", " ")}</span></div></div><div className="hidden items-end gap-2 sm:flex sm:flex-col">{salary && <Badge variant="secondary">{salary}</Badge>}{date && !Number.isNaN(date.getTime()) && <span className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="size-3" />Added {date.toLocaleDateString()}</span>}</div><div className="flex shrink-0 items-center"><Button variant="ghost" size="icon" onClick={onView} aria-label={`View ${job.title}`}><Eye className="size-4" /></Button><Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Edit ${job.title}`}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={onDelete} aria-label={`Delete ${job.title}`}><Trash2 className="size-4" /></Button></div></CardContent></Card>
}
