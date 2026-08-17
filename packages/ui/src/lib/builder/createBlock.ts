import { PageBlock, BlockType } from "../../types/builder";

// とりあえず雛形だけ

export const createBlock = (type: BlockType): PageBlock => {
  switch (type) {
    case "heading":
      return {
        id: crypto.randomUUID(),
        type,
        content: "Heading",
        styles: {
          fontSize: 36,
          fontWeight: 700,
          textAlign: "left",
        },
      };

    case "paragraph":
      return {
        id: crypto.randomUUID(),
        type,
        content: "Paragraph",
        styles: {
          fontSize: 16,
          fontWeight: 400,
          textAlign: "left",
        },
      };

    case "button":
      return {
        id: crypto.randomUUID(),
        type,
        content: "Button",
        styles: {
          fontSize: 16,
          fontWeight: 700,
          textAlign: "left",
        },
      };

    case "image":
      return {
        id: crypto.randomUUID(),
        type,
        content: "Image",
        styles: {},
      };
  }
};
