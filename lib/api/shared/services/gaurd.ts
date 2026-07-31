"servet only";

import { Role } from "@/lib/api/shared/infrastructure/prisma/generated/enums";
import { Prisma } from "@/lib/api/shared/infrastructure/prisma/generated/client";

export type PrismaModel = keyof typeof Prisma.ModelName | "Self";

const ACTIONS = ["CREATE", "READ", "UPDATE", "DELETE"] as const;
export type Action = (typeof ACTIONS)[number];

// role -> model -> allowed actions
type GuardMap = Partial<Record<Role, Partial<Record<PrismaModel, Action[]>>>>;

type UserActivityPermissions = Action[];

abstract class GaurdABC {
  protected static guardMap: GuardMap;

  static can(role: Role, model: PrismaModel, action: Action) {
    if (role === "ADMIN") return true;

    const ownActions = this.guardMap[role]?.[model] ?? [];
    if (ownActions.includes(action)) return true;

    if (role === "USER") return false; // already checked above, avoid double-checking

    const inheritedActions = this.guardMap.USER?.[model] ?? [];
    return inheritedActions.includes(action);
  }

  static getModelActions(
    role: Role,
    model: PrismaModel,
  ): UserActivityPermissions {
    if (role === "ADMIN") return ["CREATE", "DELETE", "READ", "UPDATE"];
    const allowedActions = this.guardMap[role]?.[model] ?? [];
    return allowedActions;
  }
}

export class Gaurd extends GaurdABC {
  static guardMap: GuardMap = {
    USER: {
      Self: ["CREATE", "READ", "UPDATE"],
      Comment: ["CREATE", "READ", "UPDATE"],
    },
  };
}
