"use client";

import ComponentsSidebar from "@repo/ui/components/builder/ComponentsSidebar";
import PageCanvas from "@repo/ui/components/builder/PageCanvas";
import PropertiesPanel from "@repo/ui/components/builder/PropertiesPanel";
import { useBuilderContext } from "../context/BuilderContext";

import { createBlock } from "@repo/ui/lib/builder/createBlock";

const BuilderPage = () => {
  const { state, dispatch } = useBuilderContext();

  const selectedBlock =
    state.blocks.find((block) => block.id === state.selectedBlockId) ?? null;

  return (
    <div className="h-full grid grid-cols-[220px_minmax(0,1fr)_280px] divide-x divide-gray-300">
      <ComponentsSidebar
        onAddBlock={(type) => {
          const block = createBlock(type);

          // ユーザーが事前に指定していた挿入予定位置
          let insert = state.pendingInsertPosition;

          if (!insert && state.selectedBlockId) {
            insert = {
              targetBlockId: state.selectedBlockId,
              position: "after",
            };
          }

          // ① Blockを追加する
          dispatch({
            type: "ADD_BLOCK",
            payload: {
              block,
              insert: insert ?? undefined,
            },
          });

          // ② 今追加したBlockを選択状態にする
          dispatch({
            type: "SELECT_BLOCK",
            payload: {
              blockId: block.id,
            },
          });

          // ③ 使用済みの挿入予定位置を解除する
          if (state.pendingInsertPosition) {
            dispatch({
              type: "CLEAR_PENDING_INSERT",
            });
          }
        }}
      />
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
        onDeleteBlock={(blockId) => {
          dispatch({
            type: "DELETE_BLOCK",
            payload: { blockId },
          });
        }}
        onSetPendingInsert={(insertPosition) => {
          dispatch({
            type: "SET_PENDING_INSERT",
            payload: insertPosition,
          });
        }}
        pendingInsertPosition={state.pendingInsertPosition}
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
