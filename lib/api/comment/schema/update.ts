import { z } from "zod";
import { APISuccessResponse } from "../../shared/types/response_schema/base";
import { CommentItem } from "./comment";

export const commentUpdateZodSchema = z.object({
  content: z
    .string()
    .min(3, "Content length should be more than 3 characters")
    .max(300, "Content length should be less than or equal to 300 characters"),
});

export type CommentUpdateRequest = z.infer<typeof commentUpdateZodSchema>;

export interface CommentUpdateResponse extends APISuccessResponse {
  data: CommentItem;
}
