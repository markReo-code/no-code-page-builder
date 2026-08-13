export type BlockType = "heading" | "paragraph" | "button" | "image";

export type TextAlign = "left" | "center" | "right";

export type PageBlock = {
  id: string;
  type: BlockType;
  content: string;
  styles: {
    fontSize?: number;
    fontWeight?: number;
    textAlign?: TextAlign;
  };
};

export type BuilderState = {
  blocks: PageBlock[];
  selectedBlockId: string | null;
};
