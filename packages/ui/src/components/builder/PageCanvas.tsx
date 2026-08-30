"use client";

import type {
  BlockInsertPosition,
  BlockTemplate,
  PageBlock,
} from "../../types/builder";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import InsertBlockButton from "./InsertBlockButton";
import BlockPicker from "./BlockPicker";
import { isTextBlock } from "../../lib/builder/blockGuards";
import { useCanvasFocus } from "./hooks/useCanvasFocus";
import { BlockContent } from "./BlockContent";

type PageCanvasProps = {
  blocks: PageBlock[];
  selectedId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onChangeContent: (blockId: string, content: string) => void;
  onDeleteBlock: (blockId: string, nextSelectedBlockId?: string | null) => void;
  onSetPendingInsert: (insertPosition: BlockInsertPosition) => void;
  onAddBlock: (template: BlockTemplate) => void;
  // Enter で現在の block の直後に空の text block を追加する
  onInsertTextBlockAfter: (blockId: string) => string;
  onReplaceBlock: (blockId: string, template: BlockTemplate) => string;
};

// キーボードで直接編集できる block かを判定する
const isTextEditableBlock = (block: PageBlock) => {
  return (
    block.type === "heading" ||
    block.type === "paragraph" ||
    block.type === "button"
  );
};

const PageCanvas = ({
  blocks,
  selectedId,
  onSelectBlock,
  onChangeContent,
  onDeleteBlock,
  onSetPendingInsert,
  onAddBlock,
  onInsertTextBlockAfter,
  onReplaceBlock,
}: PageCanvasProps) => {
  const [openPickerBlockId, setOpenPickerBlockId] = useState<string | null>(
    null,
  );
  const canvasRef = useRef<HTMLElement | null>(null);

  const {
    registerEditableRef,
    registerBlockWrapperRef,
    requestFocus,
    isCaretAtEnd,
  } = useCanvasFocus({ blocks, selectedId });

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

  // block を削除し、前後の block へ focus を移す
  const deleteBlockAndMoveFocus = (blockId: string) => {
    const currentIndex = blocks.findIndex((currentBlock) => {
      return currentBlock.id === blockId;
    });

    const previousBlock = blocks[currentIndex - 1] ?? null;
    const nextBlock = blocks[currentIndex + 1] ?? null;
    const nextFocusBlockId = previousBlock?.id ?? nextBlock?.id ?? null;

    if (nextFocusBlockId) {
      requestFocus({
        blockId: nextFocusBlockId,
        caret: previousBlock ? "end" : "start",
      });
    }

    onDeleteBlock(blockId, nextFocusBlockId);
  };

  // Enter で空 block を追加し、空 block の Backspace で削除する
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    block: PageBlock,
  ) => {
    const content = e.currentTarget.textContent ?? "";

    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      isTextEditableBlock(block) &&
      isCaretAtEnd(e.currentTarget)
    ) {
      e.preventDefault();

      const newBlockId = onInsertTextBlockAfter(block.id);

      requestFocus({
        blockId: newBlockId,
        caret: "start",
      });

      return;
    }

    if (e.key !== "Backspace" || content.trim() !== "") {
      return;
    }

    e.preventDefault();

    deleteBlockAndMoveFocus(block.id);
  };

  // Image などの非TextBlock のキーボード操作を扱う
  const handleBlockWrapperKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    block: PageBlock,
  ) => {
    if (isTextBlock(block)) {
      return;
    }

    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const newBlockId = onInsertTextBlockAfter(block.id);

      requestFocus({
        blockId: newBlockId,
        caret: "start",
      });

      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      deleteBlockAndMoveFocus(block.id);
    }
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

          const blockStyle: CSSProperties = isTextBlock(block)
            ? {
                fontSize: block.styles.fontSize,
                fontWeight: block.styles.fontWeight,
                textAlign: block.styles.textAlign,
              }
            : {};

          return (
            <div
              key={block.id}
              ref={registerBlockWrapperRef(block.id)}
              tabIndex={block.type === "image" ? 0 : undefined}
              onKeyDown={(e) => {
                handleBlockWrapperKeyDown(e, block);
              }}
              onClick={(e) => {
                e.stopPropagation();
                closeBlockPicker();
                onSelectBlock(block.id);

                // 非TextBlockはwrapperをfocusしてキーボード操作できるようにする
                if (!isTextBlock(block)) {
                  e.currentTarget.focus();
                }
              }}
              className={`relative min-h-[1em] p-2 ${
                isSelected
                  ? "ring-1 ring-blue-400/60"
                  : "ring-1 ring-transparent"
              }`}
              style={blockStyle}
            >
              <BlockContent
                block={block}
                registerEditableRef={registerEditableRef}
                onChangeContent={onChangeContent}
                onKeyDown={handleKeyDown}
              />

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
                    const shouldReplaceCurrentBlock =
                      block.type === "paragraph" && block.content.trim() === "";

                    if (shouldReplaceCurrentBlock) {
                      onReplaceBlock(block.id, type);
                    } else {
                      onAddBlock(type);
                    }

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
