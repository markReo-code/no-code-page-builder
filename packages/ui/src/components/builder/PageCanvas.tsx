import type { PageBlock } from "../../types/builder";

type PageCanvasProps = {
  blocks: PageBlock[];
  selectedId: string | null;
  onSelectBlock: (blockId: string) => void;
};

const PageCanvas = ({ blocks, selectedId, onSelectBlock }: PageCanvasProps) => {
  return (
    <section className="flex justify-center items-start min-w-0 min-h-full p-[32px_24px] bg-[#f5f7fb]">
      <div className="w-[min(100%,720px)] min-h-[800px] p-10 bg-white border border-[#e5e7eb] rounded">
        {blocks.map((block) => {
          const isSelected = block.id === selectedId;

          return (
            <div
              key={block.id}
              onClick={() => onSelectBlock(block.id)}
              className={
                isSelected
                  ? "outline outline-2 outline-blue-500"
                  : "outline outline-1 outline-transparent"
              }
            >
              {block.type === "heading" && <h1>{block.content}</h1>}
              {block.type === "paragraph" && <p>{block.content}</p>}
              {block.type === "button" && (
                <button type="button">{block.content}</button>
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
