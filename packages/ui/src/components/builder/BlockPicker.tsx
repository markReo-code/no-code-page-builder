import type { BlockTemplate } from "../../types/builder";
import { blockTemplateItems } from "../../lib/builder/blockTemplates";

type BlockPickerProps = {
  onSelectBlockType: (type: BlockTemplate) => void;
  onClose: () => void;
};

const BlockPicker = ({ onSelectBlockType, onClose }: BlockPickerProps) => {
  return (
    <div
      className="absolute right-2 top-full z-50 mt-2 w-72 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="max-h-80 overflow-auto">
        {blockTemplateItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              key={item.id}
              className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-100"
              onClick={() => {
                onSelectBlockType(item.template);
              }}
            >
              <Icon className="size-5 shrink-0 text-gray-700" />
              <span>
                <span className="block text-sm font-medium text-gray-900">
                  {item.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="flex w-full items-center justify-between border-t border-gray-200 px-4 py-3 text-left text-sm hover:bg-gray-100"
        onClick={onClose}
      >
        <span>メニューを閉じる</span>
        {/* <span className="text-xs text-gray-400">esc</span> */}
      </button>
    </div>
  );
};

export default BlockPicker;
