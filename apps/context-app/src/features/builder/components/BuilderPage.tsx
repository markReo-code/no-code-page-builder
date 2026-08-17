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

          dispatch({
            type: "ADD_BLOCK",
            payload: { block },
          });
        }}
      />
      <PageCanvas
        blocks={state.blocks}
        selectedId={state.selectedBlockId}
        onSelectBlock={(blockId) => {
          console.log("select block", blockId);
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
      />
    </div>
  );
};

export default BuilderPage;
