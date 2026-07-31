// Response -------------------------------------

import { APISuccessResponse } from "../../../shared/types/response_schema/base";

export interface CategoryListResponse extends APISuccessResponse {
  data: {
    id: string;
    name: string;
    createdAt: string;
  }[];
}
