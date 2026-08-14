"use client";

import ComponentsSidebar from "@repo/ui/components/builder/ComponentsSidebar";
import PageCanvas from "@repo/ui/components/builder/PageCanvas";
import PropertiesPanel from "@repo/ui/components/builder/PropertiesPanel";
import { useBuilderContext } from "../context/BuilderContext";

const BuilderPage = () => {
  const { state, dispatch } = useBuilderContext();

  const selectedBlock =
    state.blocks.find((block) => block.id === state.selectedBlockId) ?? null;

  return (
    <div className="h-full grid grid-cols-[220px_minmax(0,1fr)_280px] divide-x divide-gray-300">
      <ComponentsSidebar />
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
      />
      <PropertiesPanel selectedBlock={selectedBlock} />
    </div>
  );
};

export default BuilderPage;
