import { useForm } from "react-hook-form"
import type { CompanyFormValues } from "../schemas/company-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { companySchema } from "../schemas/company-schema"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useEffect } from "react"

interface CompanyFormProps {
  initialValues?: Partial<CompanyFormValues>;
  onSubmit: (values: CompanyFormValues) => Promise<void>;
  isSubmitting?: boolean;
  serverError?: string | null;
  submitLabel?: string;
}

export function CompanyForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  serverError,
  submitLabel = "Create company",
}: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="companyName">Company name</Label>

        <Input
          id="companyName"
          placeholder="e.g. Microsoft"
          {...register("companyName")}
        />

        {errors.companyName && (
          <p className="text-sm text-destructive">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>

          <Input
            id="industry"
            placeholder="e.g. Technology"
            {...register("industry")}
          />

          {errors.industry && (
            <p className="text-sm text-destructive">
              {errors.industry.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>

          <Input
            id="location"
            placeholder="e.g. Bengaluru, India"
            {...register("location")}
          />

          {errors.location && (
            <p className="text-sm text-destructive">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companySize">Company size</Label>

        <Input
          id="companySize"
          type="number"
          min="1"
          placeholder="e.g. 10000"
          {...register("companySize", {
            setValueAs: (value) =>
              value === "" ? undefined : Number(value),
          })}
        />

        {errors.companySize && (
          <p className="text-sm text-destructive">
            {errors.companySize.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyUrl">Company website</Label>

        <Input
          id="companyUrl"
          type="url"
          placeholder="https://example.com"
          {...register("companyUrl")}
        />

        {errors.companyUrl && (
          <p className="text-sm text-destructive">
            {errors.companyUrl.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedinUrl">LinkedIn page</Label>

        <Input
          id="linkedinUrl"
          type="url"
          placeholder="https://linkedin.com/company/example"
          {...register("linkedinUrl")}
        />

        {errors.linkedinUrl && (
          <p className="text-sm text-destructive">
            {errors.linkedinUrl.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>

        <Textarea
          id="notes"
          placeholder="Add any notes about this company..."
          rows={4}
          {...register("notes")}
        />

        {errors.notes && (
          <p className="text-sm text-destructive">
            {errors.notes.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );

}
