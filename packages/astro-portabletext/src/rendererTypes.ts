import type {
  ToolkitNestedPortableTextSpan,
  ToolkitPortableTextList,
  ToolkitPortableTextListItem,
} from '@portabletext/toolkit';
import type {
  ArbitraryTypedObject,
  PortableTextBlock,
  PortableTextBlockStyle,
  PortableTextListItemType,
  PortableTextMarkDefinition,
} from '@portabletext/types';
import type {
  InputValue,
  NormalizedBlocks,
  PortableTextAstroContext,
  PortableTextMarkType,
} from './ptTypes';

export type NodeType = 'block' | 'mark' | 'blockStyle' | 'listStyle' | 'listItemStyle';

export type MissingComponentHandler = (
  message: string,
  context: { type: string; nodeType: NodeType },
) => void;

export interface GlobalProps<ContextType = PortableTextAstroContext> {
  /**
   * Calls user-defined onMissingComponent.
   */
  missingComponentHandler: (type: string, nodeType: NodeType) => void;

  /**
   * Astro components used to render portable text.
   * This is an object with user-defined components merged with native ones.
   */
  components: PortableTextAstroComponents;

  /**
   * User-defined data context, as passed to the `<PortableText>` component.
   */
  context: ContextType;

  /**
   * Raw portable text value passed to the `<PortableText>` component.
   */
  ptRawValue: InputValue;

  /**
   * Parsed portable text value. Extracted from ptRawValue.
   */
  ptBlocks: NormalizedBlocks;
}

export interface CommonComponentProps<ContextType = PortableTextAstroContext> {
  /**
   * Refers to the index of the given node in its parent's children array.
   * If a top-level block, this will be its index in the original portable text `value`.
   */
  indexInParent: number;
  global: GlobalProps<ContextType>;
}

export interface CustomBlockComponentProps<
  BlockType extends Partial<ArbitraryTypedObject> = ArbitraryTypedObject,
  ContextType = PortableTextAstroContext,
> extends CommonComponentProps<ContextType> {
  value: BlockType;
  isInline: boolean;
  /**
   * Exclusive to inline blocks.
   */
  parentBlock?: PortableTextBlock;
}

export interface BlockComponentProps<ContextType = PortableTextAstroContext>
  extends CommonComponentProps<ContextType> {
  value: PortableTextBlock;
}

export interface ListItemComponentProps<ContextType = PortableTextAstroContext>
  extends CommonComponentProps<ContextType> {
  value: ToolkitPortableTextListItem;
}

export interface ListComponentProps<ContextType = PortableTextAstroContext>
  extends CommonComponentProps<ContextType> {
  value: ToolkitPortableTextList;
}

/**
 * Values passed under the `portableText` prop to components rendering marks.
 */
export interface MarkComponentProps<
  MarkType = PortableTextMarkDefinition,
  ContextType = PortableTextAstroContext,
> extends CommonComponentProps<ContextType>,
    Pick<ToolkitNestedPortableTextSpan, 'markKey' | 'markType'>,
    Pick<CustomBlockComponentProps, 'parentBlock'> {
  plainTextContent: string;
  value?: MarkType extends string ? undefined : MarkType;
}

export type CustomStyles =
  | Record<PortableTextBlockStyle, BlockComponent | undefined>
  | BlockComponent;

export type CustomMarks = Record<PortableTextMarkType, MarkComponent>;

export type CustomTypes = Record<string, CustomBlockComponent>;

export interface PortableTextAstroComponents {
  /**
   * Object of Astro components that renders different types of objects that might appear
   * both as part of the blocks array, or as inline objects _inside_ of a block,
   * alongside text spans.
   *
   * Use the `parentBlock` property to check whether or not this is an inline object or a block
   *
   * The object has the shape `{typeName: AstroComponent}`, where `typeName` is the value set
   * in individual `_type` attributes.
   */
  types: CustomTypes;

  /**
   * Object of Astro components that renders different types of marks that might appear in spans.
   *
   * The object has the shape `{markName: AstroComponent}`, where `markName` is the value set
   * in individual `_type` attributes, values being stored in the parent blocks `markDefs`.
   */
  marks: CustomMarks;

  /**
   * Object of Astro components that renders blocks with different `style` properties.
   *
   * The object has the shape `{styleName: AstroComponent}`, where `styleName` is the value set
   * in individual `style` attributes on blocks.
   *
   * Can also be set to a single Astro component, which would handle block styles of _any_ type.
   */
  block: CustomStyles;

  /**
   * Object of Astro components used to render lists of different types (bulleted vs numbered,
   * for instance, which by default is `<ul>` and `<ol>`, respectively)
   *
   * There is no actual "list" node type in the Portable Text specification, but a series of
   * list item blocks with the same `level` and `listItem` properties will be grouped into a
   * virtual one inside of this library.
   *
   * Can also be set to a single Astro component, which would handle lists of _any_ type.
   */
  list: Record<PortableTextListItemType, ListComponent | undefined> | ListComponent;

  /**
   * Object of Astro components used to render different list item styles.
   *
   * The object has the shape `{listItemType: AstroComponent}`, where `listItemType` is the value
   * set in individual `listItem` attributes on blocks.
   *
   * Can also be set to a single Astro component, which would handle list items of _any_ type.
   */
  listItem: Record<PortableTextListItemType, ListItemComponent | undefined> | ListItemComponent;

  /**
   * Component to use for rendering "hard breaks", eg `\n` inside of text spans
   * Will by default render a `<br />`. Pass `false` to render as-is (`\n`)
   */
  hardBreak: any;

  /* eslint-disable */
  /**
   * Override the default component for blocks of unknown type, if ignoreUnknownTypes is set to false.
   */
  unknownType: BlockComponent;

  /**
   * Override the default component for marks of unknown type. Defaults to rendering its content without a container.
   */
  unknownMark: MarkComponent;

  /**
   * Astro component used when encountering a block style there is no registered component for
   * in the `components.block` prop. Only used if `components.block` is an object.
   */
  unknownBlockStyle: BlockComponent;

  /**
   * Astro component used when encountering a list style there is no registered component for
   * in the `components.list` prop. Only used if `components.list` is an object.
   */
  unknownList: ListComponent;

  /**
   * Astro component used when encountering a list item style there is no registered component for
   * in the `components.listItem` prop. Only used if `components.listItem` is an object.
   */
  unknownListItem: ListItemComponent;
  /* eslint-enable */
}

export type PortableTextComponents = Partial<PortableTextAstroComponents>;

type BlockComponent = any;

type CustomBlockComponent = any;

type MarkComponent = any;

type ListComponent = any;

type ListItemComponent = any;
