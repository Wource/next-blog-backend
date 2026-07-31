// Request -----------------------------------------

import { array, object, string, z } from "zod";
import { APISuccessResponse } from "../../../shared/types/response_schema/base";

export const categoryCreateTranslationZodSchema = object({
  language: string().min(2).max(5),
  name: string().min(1, "Category name is required"),
});

export const categoryCreateZodSchema = object({
  translations: array(categoryCreateTranslationZodSchema).min(
    1,
    "At least one translation is required",
  ),
});

export type CategoryCreateRequest = z.infer<typeof categoryCreateZodSchema>;

// Response -------------------------------------

export interface CategoryCreateResponse extends APISuccessResponse {
  data: {
    id: string;
    translations: { id: string; language: string; name: string }[];
    createdAt: Date;
  };
}
