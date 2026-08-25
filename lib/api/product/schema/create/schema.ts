// Request -----------------------------------------

import { array, object, string, z } from "zod";
import { APISuccessResponse } from "../../../shared/types/response_schema/base";

const keyValueArray = array(
  object({
    key: string().min(1, "Key is required"),
    value: string().min(1, "Value is required"),
  }),
);

export const productCreateTranslationZodSchema = object({
  language: string().min(2).max(5),
  title: string().min(3, "Title must be at least 3 characters").max(200),
  content: string().min(10, "Content must be at least 10 characters"),
  description: string()
    .min(10, "Description must be at least 10 characters")
    .max(370, "Description should be less than 370 characters"),
  metaDescription: string().min(1, "Meta description is required"),
  specifications: keyValueArray.optional(),
  nutritionalValue: keyValueArray.optional(),
});

export const productCreateZodSchema = object({
  translations: array(productCreateTranslationZodSchema).min(
    1,
    "At least one translation is required",
  ),
  thumbnail: string().min(1, "Thumbnail is required"),
  images: array(string()).max(6, "Maximum of 6 images allowed"),
});

export type ProductCreateRequest = z.infer<typeof productCreateZodSchema>;

// Response -------------------------------------

export type ProductCreateResponse = APISuccessResponse;
