// Request -----------------------------------------

import { object, string, z } from "zod";
import { APISuccessResponse } from "../../../shared/types/response_schema/base";

export const brandCreateZodSchema = object({
  name: string().min(1, "Brand name is required").max(100),
  description: string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description should be less than 500 characters"),
  logo: string().min(1, "Logo is required"),
});

export type BrandCreateRequest = z.infer<typeof brandCreateZodSchema>;

// Response -------------------------------------

export type BrandCreateResponse = APISuccessResponse;
