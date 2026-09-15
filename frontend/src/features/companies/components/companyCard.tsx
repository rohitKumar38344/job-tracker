import { Building2, ExternalLink, MapPin, MoreHorizontal } from "lucide-react"

import type { Company } from "../api/companies-api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CompanyCardProps {
  company: Company
  onEdit: (compnay: Company) => void
  onDelete: (compnay: Company) => void
}

export function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  
  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <CardTitle className="truncate text-base">
              {company.companyName}
            </CardTitle>

            {company.industry && (
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {company.industry}
              </p>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => onEdit(company)}
          aria-label={`Edit ${company.companyName}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 text-sm text-muted-foreground">
          {company.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{company.location}</span>
            </div>
          )}

          {company.companySize && (
            <p>{company.companySize.toLocaleString()} employees</p>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            {company.companyUrl ? (
              <a
                href={company.companyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Website
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span />
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(company)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
