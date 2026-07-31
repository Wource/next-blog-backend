// Response -------------------------------------

import { APISuccessResponse } from "../../../shared/types/response_schema/base";

interface BlogOutput {
  id: string;
  slug: string;
  thumbnail: string;
  viewCount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  title: string;
  content: string;
  description: string;
  metaDescription: string;
  category: {
    id: string;
    name: string;
    categorySize: number;
  };
}

export interface CategoryGetResponse extends APISuccessResponse {
  data: {
    id: string;
    name: string;
    createdAt: string;
    blogs: BlogOutput[];
  };
}
