import type { BuilderState, PageBlock } from "@repo/ui/types/builder";

type SelectBlockAction = {
  type: "SELECT_BLOCK";
  payload: {
    blockId: string | null;
  };
};

type UpdateBlockContentAction = {
  type: "UPDATE_BLOCK_CONTENT";
  payload: {
    blockId: string;
    content: string;
  };
};

type UpdateBlockStyleAction = {
  type: "UPDATE_BLOCK_STYLES";
  payload: {
    blockId: string;
    styles: Partial<PageBlock["styles"]>;
  };
};

type AddBlockAction = {
  type: "ADD_BLOCK";
  payload: {
    block: PageBlock;
    insert?: {
      targetBlockId: string;
      position: "before" | "after";
    };
  };
};

type DeleteBlockAction = {
  type: "DELETE_BLOCK";
  payload: {
    blockId: string;
  };
};

export type BuilderAction =
  | SelectBlockAction
  | UpdateBlockContentAction
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
    // UPDATE_BLOCK_CONTENT content更新
    case "UPDATE_BLOCK_CONTENT":
      return {
        ...state,
        blocks: state.blocks.map((block) => {
          return block.id === action.payload.blockId
            ? {
                ...block,
                content: action.payload.content,
              }
            : block;
        }),
      };

    // UPDATE_BLOCK_STYLES styles更新
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
    case "ADD_BLOCK": {
      const { block, insert } = action.payload;

      if (!insert) {
        // 末尾追加
        return {
          ...state,
          blocks: [...state.blocks, block],
        };
      }

      const targetIndex = state.blocks.findIndex((currentBlock) => {
        return currentBlock.id === insert.targetBlockId;
      });

      if (targetIndex === -1) {
        // 末尾追加
        return {
          ...state,
          blocks: [...state.blocks, block],
        };
      }

      const insertIndex =
        insert.position === "before" ? targetIndex : targetIndex + 1;

      // insertIndex の位置に block を差し込む
      const newBlocks = [
        ...state.blocks.slice(0, insertIndex),
        block,
        ...state.blocks.slice(insertIndex),
      ];

      return {
        ...state,
        blocks: newBlocks,
      };
    }

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
