import { array, object, string } from "zod";

export const signUpSchema = object({
  name: string().min(1, "Name is required"),
  email: string().min(1, "Email is required").email("Invalid email"),
  password: string()
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signInSchema = object({
  email: string().min(1, "Email is required").email("Invalid email"),
  password: string()
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

const keyValueArray = array(
  object({
    key: string().min(1, "Key is required"),
    value: string().min(1, "Value is required"),
  })
);

// ------------------- Product -------------------
export const productTranslationSchema = object({
  language: string().min(2).max(5),
  title: string().min(1),
  description: string().min(1),
  specifications: keyValueArray.optional(),
  nutritionalValue: keyValueArray.optional(),
  content: string().min(1),
  metaDescription: string().min(10),
});

export const productSchema = object({
  thumbnail: string(),
  images: array(string()).max(6),
  translations: array(productTranslationSchema).min(1),
});

export const updateProductSchema = object({
  thumbnail: string().optional(),
  images: array(string()).max(6).optional(),
  translations: array(productTranslationSchema).optional(),
});

// ------------------- Blog -------------------
export const blogTranslationSchema = object({
  language: string().min(2).max(5),
  title: string().min(1),
  content: string().min(1),
  description: string().min(1),
});

export const blogSchema = object({
  categoryId: string().min(1, "Category ID is required"),
  thumbnail: string(),
  metaDescription: string().min(1, "Meta description is required"),
  translations: array(blogTranslationSchema).min(
    1,
    "At least one translation is required"
  ),
});

export const updateBlogSchema = object({
  categoryId: string().optional(),
  translations: array(blogTranslationSchema).optional(),
  thumbnail: string().optional(),
  metaDescription: string().optional(),
});

// ------------------- Category -------------------
export const categoryTranslationSchema = object({
  language: string().min(2).max(5),
  name: string().min(1, "Category name is required"),
});

export const categorySchema = object({
  translations: array(categoryTranslationSchema).min(
    1,
    "At least one translation is required"
  ),
});

export const translationSchema = object({
  language: string().min(2).max(5),
  title: string().min(3, "Title must be at least 3 characters").max(200),
  content: string().min(10, "Content must be at least 10 characters"),
  description: string()
    .min(10, "Description must be at least 10 characters")
    .max(370, "Description Should be less then 370 characters"),
});

export const blogInputSchema = object({
  categoryId: string().min(1, "Category ID is required"),
  translations: array(translationSchema).min(
    1,
    "At least one translation is required"
  ),
  thumbnail: string(),
  metaDescription: string().min(1, "Meta description is required"),
});
