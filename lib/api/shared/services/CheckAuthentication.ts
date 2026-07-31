"server only";

import { headers } from "next/headers";
import { auth } from "@/lib/api/shared/infrastructure/auth";
import { UnAuthenticatedError } from "@/lib/api/shared/types/errors";

export default async function CheckAuthentication() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new UnAuthenticatedError();
  }

  return session;
}
