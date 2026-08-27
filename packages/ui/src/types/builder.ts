// UIでの選択情報
export type BlockTemplate =
  | { type: "heading"; headingLevel: HeadingLevel }
  | { type: "paragraph" }
  | { type: "button" }
  | { type: "image" };

// Block生成に必要な情報が揃った状態
export type CreateBlockInput =
  | { type: "heading"; headingLevel: HeadingLevel }
  | { type: "paragraph" }
  | { type: "button" }
  | {
      type: "image";
      src: string;
      alt: string;
      fileName?: string;
    };

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
  href: string;
  styles: TextBlockStyles;
};

// 編集中
// export type ImageBlockStyles = {
//   width?: number;
//   borderRadius?: number;
//   alignment?: "left" | "center" | "right";
// };

export type ImageBlock = {
  id: string;
  type: "image";
  src: string;
  alt: string;
  fileName?: string;
  // mimeType: string;
  // size: number;
  // styles: ImageBlockStyles;
};

export type TextBlock = HeadingBlock | ParagraphBlock | ButtonBlock;

export type PageBlock = TextBlock | ImageBlock;

export type BlockInsertPosition = {
  targetBlockId: string;
  position: "before" | "after";
};

export type BuilderState = {
  blocks: PageBlock[];
  selectedBlockId: string | null;
  pendingInsertPosition: BlockInsertPosition | null;
};
