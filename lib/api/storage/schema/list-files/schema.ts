// Response -------------------------------------

import { APISuccessResponse } from "../../../shared/types/response_schema/base";

export interface StorageListResponse extends APISuccessResponse {
  data: {
    files: object[] | undefined;
  };
}
