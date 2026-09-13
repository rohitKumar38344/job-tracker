import { useState } from "react"
import { Plus } from "lucide-react"
import {
  useCompanies,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
} from "@/features/companies/hooks/use-companies"
import type { CompanyFormValues } from "@/features/companies/schemas/company-schema"
import { CompanyCard } from "@/features/companies/components/companyCard"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CompanyForm } from "@/features/companies/components/CompanyForm"
import type {
  Company,
  UpdateCompanyInput,
} from "@/features/companies/api/companies-api"

function CompaniesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null)
  const { data: response, isLoading, error, isError } = useCompanies()

  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()
  const deleteCompany = useDeleteCompany()
  const companies = response?.data ?? []

  async function handleCreateCompany(values: CompanyFormValues) {
    try {
      await createCompany.mutateAsync(values)
      setIsCreateOpen(false)
    } catch {
      // The form will display the mutation error.
    }
  }

  async function handleUpdateCompany(values: UpdateCompanyInput) {
    if (!editingCompany) {
      return
    }

    try {
      await updateCompany.mutateAsync({
        companyId: editingCompany.companyId,
        input: values,
      })
      setEditingCompany(null)
    } catch {
      // Error is displayed through the mutation state.
    }
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Companies</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Keep track of the companies behind your job applications.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add company
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add company</DialogTitle>

              <DialogDescription>
                Add a company to your job search.
              </DialogDescription>
            </DialogHeader>

            <CompanyForm
              onSubmit={handleCreateCompany}
              isSubmitting={createCompany.isPending}
              serverError={
                createCompany.error instanceof Error
                  ? createCompany.error.message
                  : null
              }
              submitLabel="Create company"
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={editingCompany !== null}
          onOpenChange={(open) => {
            if (!open) {
              setEditingCompany(null)
            }
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit company</DialogTitle>

              <DialogDescription>
                Update the information for {editingCompany?.companyName}.
              </DialogDescription>
            </DialogHeader>

            {editingCompany && (
              <CompanyForm
                key={editingCompany.companyId}
                initialValues={{
                  companyName: editingCompany.companyName,
                  industry: editingCompany.industry ?? undefined,
                  location: editingCompany.location ?? undefined,
                  companySize: editingCompany.companySize ?? undefined,
                  companyUrl: editingCompany.companyUrl ?? undefined,
                  linkedinUrl: editingCompany.linkedinUrl ?? undefined,
                  notes: editingCompany.notes ?? undefined,
                }}
                onSubmit={handleUpdateCompany}
                isSubmitting={updateCompany.isPending}
                serverError={
                  updateCompany.error instanceof Error
                    ? updateCompany.error.message
                    : null
                }
                submitLabel="Save changes"
              />
            )}
          </DialogContent>
        </Dialog>
        <Dialog
          open={deletingCompany !== null}
          onOpenChange={(open) => {
            if (!open) {
              setDeletingCompany(null)
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete company?</DialogTitle>

              <DialogDescription>
                This will permanently delete{" "}
                <strong>{deletingCompany?.companyName}</strong>. Any jobs and
                applications associated with this company may also be deleted
                according to your database cascade rules.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeletingCompany(null)}
                disabled={deleteCompany.isPending}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                disabled={deleteCompany.isPending}
                onClick={async () => {
                  if (!deletingCompany) {
                    return
                  }

                  try {
                    await deleteCompany.mutateAsync(deletingCompany.companyId)

                    setDeletingCompany(null)
                  } catch {
                    // Keep dialog open so the user can see the error.
                  }
                }}
              >
                {deleteCompany.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>

            {deleteCompany.error instanceof Error && (
              <p role="alert" className="text-sm text-destructive">
                {deleteCompany.error.message}
              </p>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-48 items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading companies...</p>
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error instanceof Error ? error.message : "Unable to load companies."}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && companies.length === 0 && (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>

          <h2 className="font-semibold">No companies yet</h2>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add the companies you're applying to so you can organize your job
            search.
          </p>

          <Button className="mt-5" onClick={() => setIsCreateOpen(true)}>
            Add your first company
          </Button>
        </div>
      )}

      {/* Company grid */}
      {!isLoading && !isError && companies.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard
              key={company.companyId}
              company={company}
              onEdit={setEditingCompany}
              onDelete={setDeletingCompany}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CompaniesPage
