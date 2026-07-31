// Request -----------------------------------------

import { object, string, z } from "zod";
import { APISuccessResponse } from "../../../shared/types/response_schema/base";

export const storageDeleteZodSchema = object({
  key: string().min(1, "File key is required"),
});

export type StorageDeleteRequest = z.infer<typeof storageDeleteZodSchema>;

// Response -------------------------------------

export type StorageDeleteResponse = APISuccessResponse;
