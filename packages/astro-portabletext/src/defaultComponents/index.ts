import type { PortableTextAstroComponents, PortableTextComponents } from '../rendererTypes';
import DefaultBlock from './DefaultBlock.astro';
import DefaultHardBreak from './DefaultHardBreak.astro';
import DefaultLink from './DefaultLink.astro';
import DefaultList from './DefaultList.astro';
import DefaultListItem from './DefaultListItem.astro';
import DefaultMark from './DefaultMark.astro';
import UnknownType from './UnknownType.astro';

const defaultComponents: PortableTextAstroComponents = {
  marks: {
    'strike-through': DefaultMark,
    code: DefaultMark,
    em: DefaultMark,
    strong: DefaultMark,
    underline: DefaultMark,
    link: DefaultLink,
  },
  block: {
    blockquote: DefaultBlock,
    h1: DefaultBlock,
    h2: DefaultBlock,
    h3: DefaultBlock,
    h4: DefaultBlock,
    h5: DefaultBlock,
    h6: DefaultBlock,
    normal: DefaultBlock,
  },
  list: {
    bullet: DefaultList,
    number: DefaultList,
  },
  listItem: {
    bullet: DefaultListItem,
    number: DefaultListItem,
  },
  types: {},
  hardBreak: DefaultHardBreak,
  unknownBlockStyle: DefaultBlock,
  unknownList: DefaultList,
  unknownListItem: DefaultListItem,
  unknownMark: DefaultMark,
  unknownType: UnknownType,
};

export default defaultComponents;

export function mergeComponents(
  parent: PortableTextAstroComponents,
  overrides: PortableTextComponents,
): PortableTextAstroComponents {
  return {
    ...parent,
    ...overrides,
    block: mergeDeeply(parent, overrides, 'block'),
    list: mergeDeeply(parent, overrides, 'list'),
    listItem: mergeDeeply(parent, overrides, 'listItem'),
    marks: mergeDeeply(parent, overrides, 'marks'),
    types: mergeDeeply(parent, overrides, 'types'),
  };
}

/**
 * As some components can be single functions, we can't simply spread them as objects
 */
function mergeDeeply(
  parent: PortableTextAstroComponents,
  overrides: PortableTextComponents,
  key: 'block' | 'list' | 'listItem' | 'marks' | 'types',
): PortableTextAstroComponents[typeof key] {
  const override = overrides[key];
  const parentVal = parent[key];

  if (typeof override === 'function') {
    return override;
  }

  if (override && typeof parentVal === 'function') {
    return override;
  }

  if (override) {
    return { ...parentVal, ...override } as PortableTextAstroComponents[typeof key];
  }

  return parentVal;
}
