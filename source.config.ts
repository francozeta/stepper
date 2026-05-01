import { pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      badge: z.string().optional(),
      copyCopiedLabel: z.string().optional(),
      copyImport: z.string().optional(),
      copyLabel: z.string().optional(),
      eyebrow: z.string().optional(),
      rss: z.boolean().optional(),
    }),
  },
});

export default defineConfig();
