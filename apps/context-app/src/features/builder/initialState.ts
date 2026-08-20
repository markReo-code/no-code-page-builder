import type { BuilderState } from "@repo/ui/types/builder";

export const initialState: BuilderState = {
  blocks: [],
  selectedBlockId: null,
  pendingInsertPosition: null,
};
