import { Plus } from "lucide-react";

type InsertBlockButtonProps = {
  onClick: () => void;
};

const InsertBlockButton = ({ onClick }: InsertBlockButtonProps) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-[2px] bg-[#1e1e1e] p-0 text-white hover:bg-black"
      aria-label="ブロックを追加"
    >
      <Plus className="block size-4" aria-hidden="true" />
    </button>
  );
};

export default InsertBlockButton;
