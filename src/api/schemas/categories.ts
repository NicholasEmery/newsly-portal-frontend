import { z } from "zod";

export const CategorySchema = z.object({
  label: z.string(),
  Slug: z.string(),
});

export const CategoriesSchema = CategorySchema.array();

export type Category = z.infer<typeof CategorySchema>;
