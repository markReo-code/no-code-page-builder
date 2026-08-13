import type { BuilderState } from "@repo/ui/types/builder";

export const initialState: BuilderState = {
  blocks: [
    {
      id: "heading-1",
      type: "heading",
      content: "Welcome to the Builder!",
      styles: {
        fontSize: 36,
        fontWeight: 700,
        textAlign: "left",
      },
    },
    {
      id: "paragraph-1",
      type: "paragraph",
      content: "Start editing your page here...",
      styles: {
        fontSize: 16,
        fontWeight: 400,
        textAlign: "left",
      },
    },
    {
      id: "button-1",
      type: "button",
      content: "Get Started",
      styles: {
        fontSize: 16,
        fontWeight: 700,
        textAlign: "left",
      },
    },
  ],
  selectedBlockId: null,
};
