"use client";

import ComponentsSidebar from "@repo/ui/components/builder/ComponentsSidebar";
import PageCanvas from "@repo/ui/components/builder/PageCanvas";
import PropertiesPanel from "@repo/ui/components/builder/PropertiesPanel";
import { useBuilderContext } from "../context/BuilderContext";

import { createBlock } from "@repo/ui/lib/builder/createBlock";
import { BlockTemplate } from "@repo/ui/types/builder";

const BuilderPage = () => {
  const { state, dispatch } = useBuilderContext();

  const selectedBlock =
    state.blocks.find((block) => block.id === state.selectedBlockId) ?? null;

  const handleAddBlock = (template: BlockTemplate) => {
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
