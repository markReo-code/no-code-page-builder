import { useLayoutEffect, useRef } from "react";
import type { PageBlock } from "../../../types/builder";

type UseCanvasFocusParams = {
  blocks: PageBlock[];
  selectedId: string | null;
};

type CaretPosition = "start" | "end";

type PendingFocus = {
  blockId: string;
  caret: CaretPosition;
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

export const useCanvasFocus = ({
  blocks,
  selectedId,
}: UseCanvasFocusParams) => {
  const editableRefs = useRef(new Map<string, HTMLElement>());
  const blockWrapperRefs = useRef(new Map<string, HTMLDivElement>());
  const pendingFocusRef = useRef<PendingFocus | null>(null);

  const requestFocus = (pending: PendingFocus) => {
    pendingFocusRef.current = pending;
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

  return {
    registerEditableRef,
    registerBlockWrapperRef,
    requestFocus,
    isCaretAtEnd,
  };
};
