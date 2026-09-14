import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard"
import { applicationStatuses } from "@/features/applications/api/applications-api"

const labels = {
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
}
export default function DashboardPage() {
  const { data, isPending, isError } = useDashboard()
  if (isPending)
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-xl border bg-muted"
          />
        ))}
      </div>
    )
  if (isError || !data)
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        Unable to load dashboard data. Please refresh and try again.
      </div>
    )
  const summary = [
    { label: "Saved jobs", value: data.totalJobs, icon: BriefcaseBusiness },
    { label: "Applications", value: data.totalApplications, icon: FileText },
    { label: "Interviews", value: data.totalInterviews, icon: CalendarDays },
  ]
  const chartData = applicationStatuses.map((status) => ({
    status: labels[status],
    applications: data.applicationsByStatus[status],
  }))
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Your job search
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A quick view of your current momentum.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {summary.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-4" /> Application pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72" aria-label="Application pipeline chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -18, bottom: 8 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Bar
                  dataKey="applications"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
