import { APISuccessResponse } from "../../shared/types/response_schema/base";
import { PublicCommentItem } from "./comment";
import { APIResponsePagination } from "../../shared/types/response_schema/pagination";

export interface CommentListResponse extends APISuccessResponse {
  data: {
    comments: PublicCommentItem[];
    pagination: APIResponsePagination;
  };
}
