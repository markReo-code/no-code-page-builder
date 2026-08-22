"use client";

import type {
  BlockInsertPosition,
  BlockType,
  PageBlock,
} from "../../types/builder";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import InsertBlockButton from "./InsertBlockButton";
import BlockPicker from "./BlockPicker";

type PageCanvasProps = {
  blocks: PageBlock[];
  selectedId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onChangeContent: (blockId: string, content: string) => void;
  onDeleteBlock: (blockId: string, nextSelectedBlockId?: string | null) => void;
  onSetPendingInsert: (insertPosition: BlockInsertPosition) => void;
  onAddBlock: (type: BlockType) => void;
};

const PageCanvas = ({
  blocks,
  selectedId,
  onSelectBlock,
  onChangeContent,
  onDeleteBlock,
  onSetPendingInsert,
  onAddBlock,
}: PageCanvasProps) => {
  const [openPickerBlockId, setOpenPickerBlockId] = useState<string | null>(
    null,
  );
  const canvasRef = useRef<HTMLElement | null>(null);

  // BlockPicker を閉じる共通処理
  const closeBlockPicker = () => {
    setOpenPickerBlockId(null);
  };

  // + ボタンで BlockPicker を開閉する
  const handleToggleBlockPicker = (blockId: string) => {
    if (openPickerBlockId === blockId) {
      closeBlockPicker();
      return;
    }

    onSetPendingInsert({
      targetBlockId: blockId,
      position: "after",
    });

    setOpenPickerBlockId(blockId);
  };

  // Canvas の余白クリックで選択と Picker を解除する
  const handleClearSelection = () => {
    closeBlockPicker();
    onSelectBlock(null);
  };

  // 空の block で Backspace したら削除する
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    blockId: string,
  ) => {
    const content = e.currentTarget.textContent ?? "";

    if (e.key !== "Backspace" || content.trim() !== "") {
      return;
    }

    e.preventDefault();

    const currentIndex = blocks.findIndex((block) => block.id === blockId);
    const previousBlock = blocks[currentIndex - 1] ?? null;
    const nextBlock = blocks[currentIndex + 1] ?? null;

    onDeleteBlock(blockId, previousBlock?.id ?? nextBlock?.id ?? null);
  };

  // Canvas 外クリックで Picker を閉じる
  useEffect(() => {
    if (!openPickerBlockId) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target;

      if (!(target instanceof Node)) return;

      if (canvasRef.current?.contains(target)) {
        return;
      }

      setOpenPickerBlockId(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openPickerBlockId]);

  return (
    <section
      ref={canvasRef}
      className="flex justify-center items-start min-w-0 min-h-full p-[32px_24px] bg-[#f5f7fb]"
      onClick={handleClearSelection}
    >
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
              onClick={(e) => {
                e.stopPropagation();
                closeBlockPicker();
                onSelectBlock(block.id);
              }}
              className={`relative min-h-[1em] p-2 ${
                isSelected
                  ? "ring-1 ring-blue-400/60"
                  : "ring-1 ring-transparent"
              }`}
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
                  onKeyDown={(e) => handleKeyDown(e, block.id)}
                  className="outline-none"
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
                  onKeyDown={(e) => handleKeyDown(e, block.id)}
                  className="outline-none"
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
                  onKeyDown={(e) => handleKeyDown(e, block.id)}
                  className="outline-none"
                >
                  {block.content}
                </button>
              )}
              {block.type === "image" && <div>{block.content}</div>}

              {isSelected && (
                <InsertBlockButton
                  onClick={() => {
                    handleToggleBlockPicker(block.id);
                  }}
                />
              )}

              {openPickerBlockId === block.id && (
                <BlockPicker
                  onSelectBlockType={(type) => {
                    onAddBlock(type);
                    closeBlockPicker();
                  }}
                  onClose={closeBlockPicker}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PageCanvas;
