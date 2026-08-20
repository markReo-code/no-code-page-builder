type InsertBlockButtonProps = {
  isActive: boolean;
  onClick: () => void;
};

const InsertBlockButton = ({ onClick, isActive }: InsertBlockButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute right-2 bottom-2 ${isActive ? "text-blue-500" : ""}`}
    >
      +
    </button>
  );
};

export default InsertBlockButton;
