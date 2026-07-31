// Response -------------------------------------

import { APISuccessResponse } from "../../../shared/types/response_schema/base";

export interface BlogDeleteResponse extends APISuccessResponse {
  data: {
    deletedBlogId: string;
    category: {
      id: string;
      categorySize: number;
    };
  };
}
