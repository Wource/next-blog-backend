// Response -------------------------------------

import { APISuccessResponse } from "../../../shared/types/response_schema/base";

export interface BrandDeleteResponse extends APISuccessResponse {
  data: {
    deletedBrandId: string;
  };
}
