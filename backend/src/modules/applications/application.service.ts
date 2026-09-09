import { isUniqueViolation } from "../../db/errors";
import { AppError } from "../../errors/AppError";
import { findJobByUserIdAndJobId } from "../jobs/job.repository";
import {
  findApplicationByIdAndUserId,
  findApplicationHistory,
  insertApplication,
  updateApplicationData,
  updateApplicationWithHistory,
} from "./application.repository";
import {
  CreateApplicationInput,
  UpdateApplicationInput,
  UpdateApplicationWithStatusInput,
} from "./application.validations";

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
      throw new AppError(
        "An application already exists for this job.",
        409,
        "APPLICATION_ALREADY_EXISTS",
      );
    }
    throw error;
  }
}

export async function getApplicationByIdService(
  userId: number,
  applicationId: number,
) {
  const application = await findApplicationByIdAndUserId(userId, applicationId);
  if (!application) {
    return undefined;
  }
  const applicationHistory = await findApplicationHistory(applicationId);

  return {
    ...application,
    history: applicationHistory,
  };
}

export async function updateApplicationService(
  userId: number,
  applicationId: number,
  data: UpdateApplicationInput,
) {
  const existingApplication = await findApplicationByIdAndUserId(
    userId,
    applicationId,
  );

  if (!existingApplication) {
    return undefined;
  }

  if (!hasCurrentStatus(data)) {
    return updateApplicationData(applicationId, data);
  }

  if (existingApplication.current_status === data.currentStatus) {
    throw new AppError(
      `Application is already in ${data.currentStatus} status.`,
      409,
      "STATUS_ALREADY_SET",
    );
  }

  return updateApplicationWithHistory(applicationId, data);
}

function hasCurrentStatus(
  data: UpdateApplicationInput,
): data is UpdateApplicationWithStatusInput {
  return data.currentStatus !== undefined;
}
