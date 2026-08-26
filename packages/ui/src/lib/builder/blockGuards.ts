import type { PageBlock, TextBlock } from "../../types/builder";

export const isTextBlock = (block: PageBlock): block is TextBlock => {
  return (
    block.type === "heading" ||
    block.type === "paragraph" ||
    block.type === "button"
  );
};
