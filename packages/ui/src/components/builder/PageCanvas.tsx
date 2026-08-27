"use client";

import type {
  BlockInsertPosition,
  BlockTemplate,
  PageBlock,
} from "../../types/builder";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import InsertBlockButton from "./InsertBlockButton";
import BlockPicker from "./BlockPicker";
import { isTextBlock } from "../../lib/builder/blockGuards";

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

type PendingFocus = {
  blockId: string;
  caret: "start" | "end";
};

// キーボードで直接編集できる block かを判定する
const isTextEditableBlock = (block: PageBlock) => {
  return (
    block.type === "heading" ||
    block.type === "paragraph" ||
    block.type === "button"
  );
};

// contentEditable に focus し、caret を先頭または末尾に置く
const setCaret = (element: HTMLElement, caret: PendingFocus["caret"]) => {
  element.focus();

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(caret === "start");

  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
};

// caret が contentEditable の末尾にあるかを判定する
const isCaretAtEnd = (element: HTMLElement) => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return false;
  }

  const currentRange = selection.getRangeAt(0);

  if (!currentRange.collapsed) {
    return false;
  }

  if (!element.contains(currentRange.endContainer)) {
    return false;
  }

  const textAfterCaretRange = currentRange.cloneRange();
  textAfterCaretRange.selectNodeContents(element);
  textAfterCaretRange.setStart(
    currentRange.endContainer,
    currentRange.endOffset,
  );

  return textAfterCaretRange.toString() === "";
};

const headingTagByLevel = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

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
  const editableRefs = useRef(new Map<string, HTMLElement>());
  const blockWrapperRefs = useRef(new Map<string, HTMLDivElement>());
  const pendingFocusRef = useRef<PendingFocus | null>(null);

  // BlockPicker を閉じる共通処理
  const closeBlockPicker = () => {
    setOpenPickerBlockId(null);
  };

  // contentEditable の DOM を blockId ごとに保持する
  const registerEditableRef = (blockId: string) => {
    return (node: HTMLElement | null) => {
      if (node) {
        editableRefs.current.set(blockId, node);
      } else {
        editableRefs.current.delete(blockId);
      }
    };
  };

  // Block wrapper のDOMを blockId ごとに保持する
  const registerBlockWrapperRef = (blockId: string) => {
    return (node: HTMLDivElement | null) => {
      if (node) {
        blockWrapperRefs.current.set(blockId, node);
      } else {
        blockWrapperRefs.current.delete(blockId);
      }
    };
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
      pendingFocusRef.current = {
        blockId: nextFocusBlockId,
        caret: previousBlock ? "end" : "start",
      };
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

      pendingFocusRef.current = {
        blockId: newBlockId,
        caret: "start",
      };

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

      pendingFocusRef.current = {
        blockId: newBlockId,
        caret: "start",
      };
      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      deleteBlockAndMoveFocus(block.id);
    }
  };

  // block 追加・削除後に、予約された block へ focus / caret を復元する
  useLayoutEffect(() => {
    const pending = pendingFocusRef.current;
    if (!pending) return;

    const editableElement = editableRefs.current.get(pending.blockId);

    if (editableElement) {
      setCaret(editableElement, pending.caret);
      pendingFocusRef.current = null;
      return;
    }

    const wrapperElement = blockWrapperRefs.current.get(pending.blockId);

    if (wrapperElement) {
      wrapperElement.focus();
    }

    pendingFocusRef.current = null;
  }, [blocks, selectedId]);

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

  // block の種類に応じた編集可能な表示内容を描画する
  const renderBlockContent = (block: PageBlock) => {
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
            onKeyDown={(e) => handleKeyDown(e, block)}
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
            onKeyDown={(e) => handleKeyDown(e, block)}
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
            onKeyDown={(e) => handleKeyDown(e, block)}
            className="inline-flex min-h-10 max-w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm leading-snug text-white outline-none whitespace-normal break-words"
          >
            {block.content}
          </span>
        );

      case "image":
        return <img src={block.src} alt={block.alt} className="max-w-full" />;
    }
  };

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
              {renderBlockContent(block)}

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
