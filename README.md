# Portable Text Renderer for Astro

![npm (scoped)](https://img.shields.io/npm/v/@rshackleton/astro-portabletext) [![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Render [Portable Text](https://portabletext.org) block content with [Astro](https://astro.build/) components.

## Example

```astro
---
// index.astro

import Code from './Code.astro';

// Get some data from Sanity, the "content" field should be a block array
// Ref: https://www.sanity.io/docs/block-type
const { content } = getPageData();
---

<PortableText
  components={{
    types: {
      code: Code,
    },
  }}
  value={content}
/>
```

```astro
---
// Code.astro

interface Props {
  portableText: {
    value: {
      content: string;
    };
  };
}

const { content } = Astro.props.portableText.value;
---

<pre>{content}</pre>
```

### Framework Components (React, Vue, etc)

Whilst the PortableText component can only directly render Astro components, you can still use components from your preferred framework inside those Astro components.

```tsx
// Code.tsx

type CodeProps = { content: string; }

const Code = (props: CodeProps) => {
  return (
    <pre>{props.content}</pre>
  );
}
```


```astro
---
// Code.astro

import Code from './Code.tsx';

interface Props {
  portableText: {
    value: {
      content: string;
    };
  };
}

const { content } = Astro.props.portableText.value;
---

<Code content={content} client:visible />
```

## Credits

This package wouldn't exist without the official [@portabletext/svelte](https://github.com/portabletext/svelte-portabletext/) package which provided an enormous amount of reference and inspiration.

## License

MIT-licensed. See LICENSE.
