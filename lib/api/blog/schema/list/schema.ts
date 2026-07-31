// Response -------------------------------------

import { APIResponsePagination } from "@/lib/api/shared/types/response_schema/pagination";
import { APISuccessResponse } from "../../../shared/types/response_schema/base";
import { Blog } from "../schema";

export interface BlogListResponse extends APISuccessResponse {
  data: {
    blogs: Blog[];
    pagination: APIResponsePagination;
  };
}
