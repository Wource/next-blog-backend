// Response -------------------------------------

import { APIResponsePagination } from "@/lib/api/shared/types/response_schema/pagination";
import { APISuccessResponse } from "../../../shared/types/response_schema/base";
import { Product } from "../schema";

export interface ProductListResponse extends APISuccessResponse {
  data: {
    products: Product[];
    pagination: APIResponsePagination;
  };
}
