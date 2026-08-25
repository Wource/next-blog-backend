export interface Product {
  id: string;
  slug: string;
  thumbnail: string;
  images: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  title: string;
  description: string;
  content: string;
  metaDescription: string;
  specifications: { key: string; value: string }[];
  nutritionalValue: { key: string; value: string }[];
}
