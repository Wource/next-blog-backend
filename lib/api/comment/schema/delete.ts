import { APISuccessResponse } from "../../shared/types/response_schema/base";

export interface CommentDeleteResponse extends APISuccessResponse {
  data: {
    deletedCommentId: string;
  };
}
