// Response -------------------------------------

import { APISuccessResponse } from "../../../shared/types/response_schema/base";
import { Blog } from "../schema";

export interface BlogGetResponse extends APISuccessResponse {
  data: Blog;
}
