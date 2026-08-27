import { isTextBlock } from "@repo/ui/lib/builder/blockGuards";
import type {
  BuilderState,
  BlockInsertPosition,
  PageBlock,
  TextBlockStyles,
} from "@repo/ui/types/builder";

type SelectBlockAction = {
  type: "SELECT_BLOCK";
  payload: {
    blockId: string | null;
  };
};

type AddBlockAction = {
  type: "ADD_BLOCK";
  payload: {
    block: PageBlock;
    insert?: BlockInsertPosition;
  };
};

type ReplaceBlockAction = {
  type: "REPLACE_BLOCK";
  payload: {
    blockId: string;
    block: PageBlock;
  };
};

type DeleteBlockAction = {
  type: "DELETE_BLOCK";
  payload: {
    blockId: string;
    nextSelectedBlockId?: string | null;
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
    styles: Partial<TextBlockStyles>;
  };
};

type UpdateButtonHrefAction = {
  type: "UPDATE_BUTTON_HREF";
  payload: {
    blockId: string;
    href: string;
  };
};

// 挿入予定位置を保存するAction
type SetPendingInsertAction = {
  type: "SET_PENDING_INSERT";
  payload: BlockInsertPosition;
};

// 保存していた挿入予定位置を削除するAction
type ClearPendingInsertAction = {
  type: "CLEAR_PENDING_INSERT";
};

export type BuilderAction =
  | SelectBlockAction
  | AddBlockAction
  | ReplaceBlockAction
  | DeleteBlockAction
  | UpdateBlockContentAction
  | UpdateBlockStyleAction
  | UpdateButtonHrefAction
  | SetPendingInsertAction
  | ClearPendingInsertAction;

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

    // REPLACE_BLOCK
    case "REPLACE_BLOCK":
      return {
        ...state,
        blocks: state.blocks.map((block) => {
          return block.id === action.payload.blockId
            ? action.payload.block
            : block;
        }),
        selectedBlockId: action.payload.block.id,
        pendingInsertPosition: null,
      };

    // DELETE_BLOCK
    case "DELETE_BLOCK":
      return {
        ...state,
        blocks: state.blocks.filter(
          (block) => block.id !== action.payload.blockId,
        ),

        // 削除されたBlockを「選択中」として残さない
        selectedBlockId:
          state.selectedBlockId === action.payload.blockId
            ? (action.payload.nextSelectedBlockId ?? null)
            : state.selectedBlockId,

        // 削除されたBlockを「挿入基準」として残さない
        pendingInsertPosition:
          state.pendingInsertPosition?.targetBlockId === action.payload.blockId
            ? null
            : state.pendingInsertPosition,
      };

    // UPDATE_BLOCK_CONTENT content更新
    case "UPDATE_BLOCK_CONTENT":
      return {
        ...state,
        blocks: state.blocks.map((block) => {
          return block.id === action.payload.blockId && isTextBlock(block)
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
          return block.id === action.payload.blockId && isTextBlock(block)
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

    case "UPDATE_BUTTON_HREF":
      return {
        ...state,
        blocks: state.blocks.map((block) => {
          return block.id === action.payload.blockId && block.type === "button"
            ? { ...block, href: action.payload.href }
            : block;
        }),
      };

    // SET_PENDING_INSERT
    case "SET_PENDING_INSERT":
      return {
        ...state,
        pendingInsertPosition: action.payload,
      };

    // CLEAR_PENDING_INSERT
    case "CLEAR_PENDING_INSERT":
      return {
        ...state,
        pendingInsertPosition: null,
      };
  }
};
