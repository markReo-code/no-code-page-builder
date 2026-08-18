import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import type { PageBlock, TextAlign } from "../../types/builder";
import { FontSizeControl } from "./FontSizeControl";

const FONT_WEIGHT_OPTIONS = [
  { label: "Thin", value: 100 },
  { label: "Extra Light", value: 200 },
  { label: "Light", value: 300 },
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semi Bold", value: 600 },
  { label: "Bold", value: 700 },
  { label: "Extra Bold", value: 800 },
  { label: "Black", value: 900 },
];

const TEXT_ALIGN_OPTIONS = [
  { value: "left", label: "Align left", icon: AlignLeft },
  { value: "center", label: "Align center", icon: AlignCenter },
  { value: "right", label: "Align right", icon: AlignRight },
] satisfies {
  value: TextAlign;
  label: string;
  icon: typeof AlignLeft;
}[];

type PropertiesPanelProps = {
  selectedBlock: PageBlock | null;
  onChangeStyles: (styles: Partial<PageBlock["styles"]>) => void;
  onDeleteBlock: (blockId: string) => void;
};

const PropertiesPanel = ({
  selectedBlock,
  onChangeStyles,
  onDeleteBlock,
}: PropertiesPanelProps) => {
  return (
    <aside className="">
      <div className="px-4 py-4 border-b border-gray-300">
        <h2 className="text-blue-500 font-medium">Properties</h2>
        {selectedBlock && <p className="capitalize">{selectedBlock.type}</p>}
      </div>
      {selectedBlock && (
        <div className="space-y-7 px-6 py-6">
          <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4">
            <label
              htmlFor="font-size"
              className="text-sm font-bold text-slate-600"
            >
              Size
            </label>
            <FontSizeControl
              id="font-size"
              value={selectedBlock?.styles.fontSize}
              disabled={!selectedBlock}
              onChange={(fontSize) => {
                onChangeStyles({ fontSize });
              }}
            />
          </div>

          <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4">
            <label
              htmlFor="font-weight"
              className="text-sm font-bold text-slate-600"
            >
              Weight
            </label>
            <div className="w-full max-w-[224px] justify-self-end">
              <select
                id="font-weight"
                className="h-11 w-full border border-slate-300 bg-white px-3 text-[15px] font-semibold text-slate-900 outline-none"
                value={selectedBlock.styles.fontWeight ?? 400}
                onChange={(e) => {
                  const fontWeight = Number(e.currentTarget.value);

                  onChangeStyles({ fontWeight });
                }}
              >
                {FONT_WEIGHT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-slate-600">
              Alignment
            </legend>
            <div className="grid w-full h-10 grid-cols-3 overflow-hidden rounded-[2px] border border-slate-300">
              {TEXT_ALIGN_OPTIONS.map((option, index) => {
                const Icon = option.icon;
                const isActive =
                  selectedBlock.styles.textAlign === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-label={option.label}
                    className={`grid place-items-center
                      ${index !== TEXT_ALIGN_OPTIONS.length - 1 ? "border-r border-slate-300" : ""}
                      ${isActive ? "bg-blue-50 text-slate-900" : "bg-white text-slate-600"}
                      `}
                    onClick={() => {
                      onChangeStyles({ textAlign: option.value });
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 px-4 py-2 has-[>svg]:px-3 h-9 w-20 bg-black text-white hover:bg-slate-800"
              onClick={() => {
                onDeleteBlock(selectedBlock.id);
              }}
            >
              削除する
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default PropertiesPanel;
