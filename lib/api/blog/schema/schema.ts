export interface Blog {
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