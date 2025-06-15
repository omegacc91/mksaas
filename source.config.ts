import { defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

const customDocsSchema = frontmatterSchema.extend({
  preview: z.string().optional(),
  index: z.boolean().default(false),
});

const customMetaSchema = metaSchema.extend({
  description: z.string().optional(),
});

/**
 * frontmatterSchema.extend causes error: Type instantiation is excessively deep,
 * so we define the schema manually.
 *
 * https://fumadocs.dev/docs/mdx/collections#schema-1
 */
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: customDocsSchema,
  },
  meta: {
    schema: customMetaSchema,
  },
});
