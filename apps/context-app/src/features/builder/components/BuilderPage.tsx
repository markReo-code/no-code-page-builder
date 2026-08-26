"use client";

import ComponentsSidebar from "@repo/ui/components/builder/ComponentsSidebar";
import PageCanvas from "@repo/ui/components/builder/PageCanvas";
import PropertiesPanel from "@repo/ui/components/builder/PropertiesPanel";
import { useBuilderContext } from "../context/BuilderContext";

import { createBlock } from "@repo/ui/lib/builder/createBlock";
import { BlockTemplate, BlockInsertPosition } from "@repo/ui/types/builder";
import { ChangeEvent, useRef } from "react";

type PendingImageAction =
  | {
      type: "add";
      insert?: BlockInsertPosition;
    }
  | {
      type: "replace";
      blockId: string;
    };

const BuilderPage = () => {
  const { state, dispatch } = useBuilderContext();

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const pendingImageActionRef = useRef<PendingImageAction | null>(null);

  const selectedBlock =
    state.blocks.find((block) => block.id === state.selectedBlockId) ?? null;

  const openImageFilePicker = (action: PendingImageAction) => {
    pendingImageActionRef.current = action;

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
      imageInputRef.current.click();
    }
  };

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    const pendingAction = pendingImageActionRef.current;

    pendingImageActionRef.current = null;

    if (!file || !pendingAction) {
      return;
    }

    const block = createBlock({
      type: "image",
      src: URL.createObjectURL(file),
      alt: file.name,
      fileName: file.name,
    });

    if (pendingAction.type === "add") {
      dispatch({
        type: "ADD_BLOCK",
        payload: {
          block,
          insert: pendingAction.insert,
        },
      });
    }

    if (pendingAction.type === "replace") {
      dispatch({
        type: "REPLACE_BLOCK",
        payload: {
          blockId: pendingAction.blockId,
          block,
        },
      });
    }

    dispatch({
      type: "SELECT_BLOCK",
      payload: {
        blockId: block.id,
      },
    });

    if (state.pendingInsertPosition) {
      dispatch({
        type: "CLEAR_PENDING_INSERT",
      });
    }
  };

  const handleAddBlock = (template: BlockTemplate) => {
    if (template.type === "image") {
      let insert = state.pendingInsertPosition;

      if (!insert && state.selectedBlockId) {
        insert = {
          targetBlockId: state.selectedBlockId,
          position: "after",
        };
      }

      openImageFilePicker({
        type: "add",
        insert: insert ?? undefined,
      });

      if (state.pendingInsertPosition) {
        dispatch({
          type: "CLEAR_PENDING_INSERT",
        });
      }

      return;
    }

    const block = createBlock(template);

    let insert = state.pendingInsertPosition;

    if (!insert && state.selectedBlockId) {
      insert = {
        targetBlockId: state.selectedBlockId,
        position: "after",
      };
    }

    dispatch({
      type: "ADD_BLOCK",
      payload: {
        block,
        insert: insert ?? undefined,
      },
    });

    dispatch({
      type: "SELECT_BLOCK",
      payload: {
        blockId: block.id,
      },
    });

    if (state.pendingInsertPosition) {
      dispatch({
        type: "CLEAR_PENDING_INSERT",
      });
    }
  };

  const handleReplaceBlock = (blockId: string, template: BlockTemplate) => {
    if (template.type === "image") {
      openImageFilePicker({
        type: "replace",
        blockId,
      });

      return blockId;
    }

    const block = createBlock(template);

    dispatch({
      type: "REPLACE_BLOCK",
      payload: {
        blockId,
        block,
      },
    });

    return block.id;
  };

  const handleInsertTextBlockAfter = (blockId: string) => {
    const block = {
      ...createBlock({ type: "paragraph" }),
      content: "",
    };

    dispatch({
      type: "ADD_BLOCK",
      payload: {
        block,
        insert: {
          targetBlockId: blockId,
          position: "after",
        },
      },
    });

    dispatch({
      type: "SELECT_BLOCK",
      payload: {
        blockId: block.id,
      },
    });

    if (state.pendingInsertPosition) {
      dispatch({
        type: "CLEAR_PENDING_INSERT",
      });
    }

    return block.id;
  };

  return (
    <div className="h-full grid grid-cols-[220px_minmax(0,1fr)_280px] divide-x divide-gray-300">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />
      <ComponentsSidebar onAddBlock={handleAddBlock} />
      <PageCanvas
        blocks={state.blocks}
        selectedId={state.selectedBlockId}
        onSelectBlock={(blockId) => {
          dispatch({
            type: "SELECT_BLOCK",
            payload: { blockId },
          });
        }}
        onChangeContent={(blockId, content) => {
          dispatch({
            type: "UPDATE_BLOCK_CONTENT",
            payload: {
              blockId,
              content,
            },
          });
        }}
        onDeleteBlock={(blockId, nextSelectedBlockId) => {
          dispatch({
            type: "DELETE_BLOCK",
            payload: { blockId, nextSelectedBlockId },
          });
        }}
        onSetPendingInsert={(insertPosition) => {
          dispatch({
            type: "SET_PENDING_INSERT",
            payload: insertPosition,
          });
        }}
        onAddBlock={handleAddBlock}
        onInsertTextBlockAfter={handleInsertTextBlockAfter}
        onReplaceBlock={handleReplaceBlock}
      />
      <PropertiesPanel
        selectedBlock={selectedBlock}
        onChangeStyles={(styles) => {
          if (!selectedBlock) return;

          dispatch({
            type: "UPDATE_BLOCK_STYLES",
            payload: {
              blockId: selectedBlock.id,
              styles,
            },
          });
        }}
        onDeleteBlock={(blockId) => {
          dispatch({
            type: "DELETE_BLOCK",
            payload: {
              blockId,
            },
          });
        }}
      />
    </div>
  );
};

export default BuilderPage;
