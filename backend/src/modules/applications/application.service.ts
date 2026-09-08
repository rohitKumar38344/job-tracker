import { isUniqueViolation } from "../../db/errors";
import { AppError } from "../../errors/AppError";
import { findJobByUserIdAndJobId } from "../jobs/job.repository";
import { insertApplication } from "./application.repository";
import { CreateApplicationInput } from "./application.validations";

export async function addApplicationService(
  userId: number,
  data: CreateApplicationInput,
) {
  const existingJob = await findJobByUserIdAndJobId(userId, data.jobId);

  if (!existingJob) {
    return undefined;
  }

  try {
    const application = await insertApplication(data);
    return application;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AppError("An application already exists for this job.", 409, "APPLICATION_ALREADY_EXISTS");
    }
    throw error;
  }
}
