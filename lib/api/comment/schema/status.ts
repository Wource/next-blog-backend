import { z } from "zod";
import { APISuccessResponse } from "../../shared/types/response_schema/base";
import { CommentItem } from "./comment";

const statusValues = ["approved", "rejected"] as const;

export const commentStatusZodSchema = z.object({
  status: z.enum(statusValues),
});

export type CommentStatusRequest = z.infer<typeof commentStatusZodSchema>;

export interface CommentStatusResponse extends APISuccessResponse {
  data: CommentItem;
}
