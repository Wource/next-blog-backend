// Request -----------------------------------------

import { array, object, string, z } from "zod";
import { APISuccessResponse } from "../../../shared/types/response_schema/base";

export const blogCreateTranslationZodSchema = object({
  language: string().min(2).max(5),
  title: string().min(3, "Title must be at least 3 characters").max(200),
  content: string().min(10, "Content must be at least 10 characters"),
  description: string()
    .min(10, "Description must be at least 10 characters")
    .max(370, "Description Should be less then 370 characters"),
});

export const blogCreateZodSchema = object({
  categoryId: string().min(1, "Category ID is required"),
  translations: array(blogCreateTranslationZodSchema).min(
    1,
    "At least one translation is required",
  ),
  thumbnail: string(),
  metaDescription: string().min(1, "Meta description is required"),
});

export type BlogCreateRequest = z.infer<typeof blogCreateZodSchema>;

// Response -------------------------------------

export interface BlogCreateResponse extends APISuccessResponse {}
