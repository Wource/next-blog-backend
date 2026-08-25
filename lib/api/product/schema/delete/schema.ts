// Response -------------------------------------

import { APISuccessResponse } from "../../../shared/types/response_schema/base";

export interface ProductDeleteResponse extends APISuccessResponse {
  data: {
    deletedProductId: string;
  };
}
