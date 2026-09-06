import { AppError } from "../../errors/AppError";
import { findJobByUserIdAndJobId, updateJobData } from "./job.repository";
import { UpdateJobInput } from "./job.validation";

export async function updateJobService(
  userId: number,
  jobId: number,
  data: UpdateJobInput,
) {
  const existingJob = await findJobByUserIdAndJobId(userId, jobId);

  if (!existingJob) {
    return undefined;
  }

  const finalSalaryMin =
    data.salaryMin !== undefined ? data.salaryMin : existingJob.salary_min;
  const finalSalaryMax =
    data.salaryMax !== undefined ? data.salaryMax : existingJob.salary_max;

  if (
    finalSalaryMax !== null &&
    finalSalaryMin !== null &&
    finalSalaryMax < finalSalaryMin
  ) {
    throw new AppError(
      "Maximum salary must be equal to or greater than minimum salary.",
      400,
    );
  }

  const updatedJob = await updateJobData(userId, jobId, data);
  return updatedJob;
}