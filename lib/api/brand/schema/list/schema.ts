// Response -------------------------------------

import { APISuccessResponse } from "../../../shared/types/response_schema/base";
import { Brand } from "../schema";

export interface BrandListResponse extends APISuccessResponse {
  data: {
    brands: Brand[];
  };
}
