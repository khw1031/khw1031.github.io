import { z } from 'zod';

export const detailContentSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.array(z.string().min(1)).default([]),
    url: z.string().min(1).optional(),
    kind: z.enum(['list', 'prose']).default('list'),
  })
  .refine((c) => Boolean(c.title) || c.description.length > 0, {
    message: 'detail content must have a title or at least one description line',
  });

export const detailSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1).optional(),
  period: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  url: z.string().min(1).optional(),
  ect: z.string().min(1).optional(),
  content: z.array(detailContentSchema).default([]),
});

export const sectionSchema = z.object({
  title: z.string().min(1),
  details: z.array(detailSchema).min(1),
});

export const documentPageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  hideContact: z.boolean().default(false),
  sections: z.array(sectionSchema).min(1),
  keywords: z.array(z.string().min(1)).default([]),
});

export type DetailContent = z.infer<typeof detailContentSchema>;
export type Detail = z.infer<typeof detailSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type DocumentPage = z.infer<typeof documentPageSchema>;
