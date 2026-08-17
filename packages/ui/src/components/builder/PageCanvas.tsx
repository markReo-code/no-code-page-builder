import type { PageBlock } from "../../types/builder";
import type { CSSProperties } from "react";

type PageCanvasProps = {
  blocks: PageBlock[];
  selectedId: string | null;
  onSelectBlock: (blockId: string) => void;
  onChangeContent: (blockId: string, content: string) => void;
};

const PageCanvas = ({
  blocks,
  selectedId,
  onSelectBlock,
  onChangeContent,
}: PageCanvasProps) => {
  return (
    <section className="flex justify-center items-start min-w-0 min-h-full p-[32px_24px] bg-[#f5f7fb]">
      <div className="w-[min(100%,720px)] min-h-[800px] p-10 bg-white border border-[#e5e7eb] rounded">
        {blocks.map((block) => {
          const isSelected = block.id === selectedId;

          const blockStyle: CSSProperties = {
            fontSize: block.styles.fontSize,
            fontWeight: block.styles.fontWeight,
            textAlign: block.styles.textAlign,
          };

          return (
            <div
              key={block.id}
              onClick={() => onSelectBlock(block.id)}
              className={
                isSelected
                  ? "outline outline-2 outline-blue-500"
                  : "outline outline-1 outline-transparent"
              }
              style={blockStyle}
            >
              {block.type === "heading" && (
                <h1
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    onChangeContent(
                      block.id,
                      e.currentTarget.textContent ?? "",
                    );
                  }}
                >
                  {block.content}
                </h1>
              )}

              {block.type === "paragraph" && (
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    onChangeContent(
                      block.id,
                      e.currentTarget.textContent ?? "",
                    );
                  }}
                >
                  {block.content}
                </p>
              )}
              {block.type === "button" && (
                <button
                  type="button"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    onChangeContent(
                      block.id,
                      e.currentTarget.textContent ?? "",
                    );
                  }}
                >
                  {block.content}
                </button>
              )}
              {block.type === "image" && <div>{block.content}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PageCanvas;
