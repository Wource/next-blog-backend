import { z } from "zod";
import { APISuccessResponse } from "../../shared/types/response_schema/base";

export const commentCreateZodSchema = z.object({
  content: z
    .string()
    .min(3, "Content length should be more than 3 characters")
    .max(300, "Content length should be less than or equal to 300 characters"),
  blogId: z.cuid2("Invalid blogId"),
});

export type CommentCreateRequest = z.infer<typeof commentCreateZodSchema>;
export type CommentCreateResponse = APISuccessResponse;
