"server only";

import { Role } from "@/lib/api/shared/infrastructure/prisma/generated/enums";
import { Session } from "../infrastructure/auth";
import { Action, Gaurd, PrismaModel } from "./gaurd";
import { UnAuthenticatedError, UnAuthorizedError } from "../types/errors";

export default async function CheckAuthorization(
  session: Session | null,
  model: PrismaModel,
  activity: Action,
) {
  if (!session) {
    throw new UnAuthenticatedError();
  }

  if (!session.user.role) {
    throw new UnAuthenticatedError();
  }

  const role = session.user.role as Role;

  if (!Gaurd.can(role, model, activity)) {
    throw new UnAuthorizedError();
  }
}
