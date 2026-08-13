import type { BuilderState, PageBlock } from "@repo/ui/types/builder";

type SelectBlockAction = {
  type: "SELECT_BLOCK";
  payload: {
    blockId: string | null;
  };
};

type UpdateBlockStyleAction = {
  type: "UPDATE_BLOCK_STYLES";
  payload: {
    blockId: string;
    styles: Partial<PageBlock["styles"]>;
  };
};

// 追記１
type AddBlockAction = {
  type: "ADD_BLOCK";
  payload: {
    block: PageBlock;
  };
};

// 追記2
type DeleteBlockAction = {
  type: "DELETE_BLOCK";
  payload: {
    blockId: string;
  };
};

type BuilderAction =
  | SelectBlockAction
  | UpdateBlockStyleAction
  | AddBlockAction
  | DeleteBlockAction;

export const builderReducer = (
  state: BuilderState,
  action: BuilderAction,
): BuilderState => {
  switch (action.type) {
    case "SELECT_BLOCK":
      return {
        ...state,
        selectedBlockId: action.payload.blockId,
      };
    // UPDATE_BLOCK_STYLES
    case "UPDATE_BLOCK_STYLES":
      return {
        ...state,
        blocks: state.blocks.map((block) => {
          return block.id === action.payload.blockId
            ? {
                ...block,
                styles: {
                  ...block.styles,
                  ...action.payload.styles,
                },
              }
            : block;
        }),
      };
    // ADD_BLOCK
    case "ADD_BLOCK":
      return {
        ...state,
        blocks: [...state.blocks, action.payload.block],
      };

    // DELETE_BLOCK
    case "DELETE_BLOCK":
      return {
        ...state,
        blocks: state.blocks.filter(
          (block) => block.id !== action.payload.blockId,
        ),

        selectedBlockId:
          state.selectedBlockId === action.payload.blockId
            ? null
            : state.selectedBlockId,
      };
  }
};
