import {
  ImageIcon,
  LucideIcon,
  MousePointerClick,
  Pilcrow,
  Type,
} from "lucide-react";
import type { BlockType } from "../../types/builder";

type ComponentsSidebarProps = {
  onAddBlock: (type: BlockType) => void;
};

type ComponentItem = {
  type: BlockType;
  label: string;
  icon: LucideIcon;
};

const componentItems: ComponentItem[] = [
  { type: "heading", label: "Heading", icon: Type },
  { type: "paragraph", label: "Paragraph", icon: Pilcrow },
  { type: "button", label: "Button", icon: MousePointerClick },
  { type: "image", label: "Image", icon: ImageIcon },
];

const ComponentsSidebar = ({ onAddBlock }: ComponentsSidebarProps) => {
  return (
    <aside className="">
      <div className="px-4 py-4 border-b border-gray-300">
        <h2 className="text-blue-500 font-medium">Components</h2>
        <p className="text-sm">Add to canvas</p>
      </div>
      <ul className="px-4 py-4 space-y-2">
        {componentItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.type}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => onAddBlock(item.type)}
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
