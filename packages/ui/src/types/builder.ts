export type BlockTemplate =
  | { type: "heading"; headingLevel: HeadingLevel }
  | { type: "paragraph" }
  | { type: "button" }
  | { type: "image" };

export type TextAlign = "left" | "center" | "right";

export type TextBlockStyles = {
  fontSize?: number;
  fontWeight?: number;
  textAlign?: TextAlign;
};

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingBlock = {
  id: string;
  type: "heading";
  content: string;
  headingLevel: HeadingLevel;
  styles: TextBlockStyles;
};

export type ParagraphBlock = {
  id: string;
  type: "paragraph";
  content: string;
  styles: TextBlockStyles;
};

export type ButtonBlock = {
  id: string;
  type: "button";
  content: string;
  styles: TextBlockStyles;
};

// 別ブランチやる予定なので、とりあえず互換性のため残しています
export type ImageBlock = {
  id: string;
  type: "image";
  content: string;
  styles: TextBlockStyles;
};

export type PageBlock =
  | HeadingBlock
  | ParagraphBlock
  | ButtonBlock
  | ImageBlock;

export type BlockInsertPosition = {
  targetBlockId: string;
  position: "before" | "after";
};

export type BuilderState = {
  blocks: PageBlock[];
  selectedBlockId: string | null;
  pendingInsertPosition: BlockInsertPosition | null;
};
