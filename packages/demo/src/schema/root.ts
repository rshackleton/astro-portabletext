import { defineType } from 'sanity';

export const root = defineType({
  name: 'root',
  type: 'document',
  title: 'Root',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    },
  ],
});
