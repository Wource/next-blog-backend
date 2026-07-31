import { APISuccessResponse } from "../../shared/types/response_schema/base";
import { PublicCommentItem } from "./comment";

export interface CommentGetResponse extends APISuccessResponse {
  data: PublicCommentItem;
}
