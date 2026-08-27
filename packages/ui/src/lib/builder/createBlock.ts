import {
  PageBlock,
  HeadingLevel,
  TextBlockStyles,
  CreateBlockInput,
} from "../../types/builder";

const HEADING_DEFAULT_STYLES: Record<HeadingLevel, TextBlockStyles> = {
  1: { fontSize: 36, fontWeight: 700, textAlign: "left" },
  2: { fontSize: 30, fontWeight: 700, textAlign: "left" },
  3: { fontSize: 24, fontWeight: 700, textAlign: "left" },
  4: { fontSize: 20, fontWeight: 700, textAlign: "left" },
  5: { fontSize: 18, fontWeight: 700, textAlign: "left" },
  6: { fontSize: 16, fontWeight: 700, textAlign: "left" },
};

export const createBlock = (input: CreateBlockInput): PageBlock => {
  switch (input.type) {
    case "heading":
      return {
        id: crypto.randomUUID(),
        type: "heading",
        content: `見出し ${input.headingLevel}`,
        headingLevel: input.headingLevel,
        styles: HEADING_DEFAULT_STYLES[input.headingLevel],
      };

    case "paragraph":
      return {
        id: crypto.randomUUID(),
        type: "paragraph",
        content: "テキスト",
        styles: {
          fontSize: 16,
          fontWeight: 400,
          textAlign: "left",
        },
      };

    case "button":
      return {
        id: crypto.randomUUID(),
        type: "button",
        content: "ボタン",
        href: "",
        styles: {
          fontSize: 16,
          fontWeight: 700,
          textAlign: "left",
        },
      };

    case "image":
      return {
        id: crypto.randomUUID(),
        type: "image",
        src: input.src,
        alt: input.alt,
        fileName: input.fileName,
      };
  }
};
