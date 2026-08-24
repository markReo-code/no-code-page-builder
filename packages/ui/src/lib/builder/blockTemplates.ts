import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Type,
  MousePointerClick,
  ImageIcon,
  LucideIcon,
} from "lucide-react";

import type { BlockTemplate } from "../../types/builder";

export type BlockTemplateItem = {
  id: string;
  template: BlockTemplate;
  label: string;
  icon: LucideIcon;
};

export const blockTemplateItems: BlockTemplateItem[] = [
  {
    id: "paragraph",
    template: { type: "paragraph" },
    label: "テキスト",
    icon: Type,
  },
  {
    id: "heading-1",
    template: { type: "heading", headingLevel: 1 },
    label: "見出し 1",
    icon: Heading1,
  },
  {
    id: "heading-2",
    template: { type: "heading", headingLevel: 2 },
    label: "見出し 2",
    icon: Heading2,
  },
  {
    id: "heading-3",
    template: { type: "heading", headingLevel: 3 },
    label: "見出し 3",
    icon: Heading3,
  },
  {
    id: "heading-4",
    template: { type: "heading", headingLevel: 4 },
    label: "見出し 4",
    icon: Heading4,
  },
  {
    id: "heading-5",
    template: { type: "heading", headingLevel: 5 },
    label: "見出し 5",
    icon: Heading5,
  },
  {
    id: "heading-6",
    template: { type: "heading", headingLevel: 6 },
    label: "見出し 6",
    icon: Heading6,
  },
  {
    id: "button",
    template: { type: "button" },
    label: "ボタン",
    icon: MousePointerClick,
  },
  {
    id: "image",
    template: { type: "image" },
    label: "画像",
    icon: ImageIcon,
  },
];
