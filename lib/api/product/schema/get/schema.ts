// Response -------------------------------------

import { APISuccessResponse } from "../../../shared/types/response_schema/base";
import { Product } from "../schema";

export interface ProductGetResponse extends APISuccessResponse {
  data: Product;
}
