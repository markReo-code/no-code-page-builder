import type { BlockTemplate } from "../../types/builder";
import { blockTemplateItems } from "../../lib/builder/blockTemplates";

type ComponentsSidebarProps = {
  onAddBlock: (template: BlockTemplate) => void;
};

const ComponentsSidebar = ({ onAddBlock }: ComponentsSidebarProps) => {
  return (
    <aside className="">
      <div className="px-4 py-4 border-b border-gray-300">
        <h2 className="text-blue-500 font-medium">Components</h2>
        <p className="text-sm">Add to canvas</p>
      </div>
      <ul className="px-4 py-4 space-y-2">
        {blockTemplateItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => onAddBlock(item.template)}
              >
                <Icon
                  className="flex size-5 items-center justify-center rounded bg-gray-100 text-gray-600"
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ComponentsSidebar;
