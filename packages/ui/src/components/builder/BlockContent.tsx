import type { KeyboardEvent } from "react";
import type { PageBlock } from "../../types/builder";

type BlockContentProps = {
  block: PageBlock;
  registerEditableRef: (blockId: string) => (node: HTMLElement | null) => void;
  onChangeContent: (blockId: string, content: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>, block: PageBlock) => void;
};

const headingTagByLevel = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

// block の種類に応じた編集可能な表示内容を描画する
export const BlockContent = ({
  block,
  registerEditableRef,
  onChangeContent,
  onKeyDown,
}: BlockContentProps) => {
  switch (block.type) {
    case "heading": {
      const HeadingTag = headingTagByLevel[block.headingLevel];

      return (
        <HeadingTag
          ref={registerEditableRef(block.id)}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            onChangeContent(block.id, e.currentTarget.textContent ?? "");
          }}
          onKeyDown={(e) => onKeyDown(e, block)}
          className="outline-none"
        >
          {block.content}
        </HeadingTag>
      );
    }

    case "paragraph":
      return (
        <p
          ref={registerEditableRef(block.id)}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            onChangeContent(block.id, e.currentTarget.textContent ?? "");
          }}
          onKeyDown={(e) => onKeyDown(e, block)}
          className="outline-none"
        >
          {block.content}
        </p>
      );

    case "button":
      return (
        <span
          ref={registerEditableRef(block.id)}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            onChangeContent(block.id, e.currentTarget.textContent ?? "");
          }}
          onKeyDown={(e) => onKeyDown(e, block)}
          className="inline-flex min-h-10 max-w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm leading-snug text-white outline-none whitespace-normal break-words"
        >
          {block.content}
        </span>
      );

    case "image":
      return <img src={block.src} alt={block.alt} className="max-w-full" />;
  }
};
