import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

const FONT_WEIGHT_OPTIONS = [
  { label: "100 - Thin", value: "100" },
  { label: "200 - Extra Light", value: "200" },
  { label: "300 - Light", value: "300" },
  { label: "400 - Regular", value: "400" },
  { label: "500 - Medium", value: "500" },
  { label: "600 - Semi Bold", value: "600" },
  { label: "700 - Bold", value: "700" },
  { label: "800 - Extra Bold", value: "800" },
  { label: "900 - Black", value: "900" },
];

const PropertiesPanel = () => {
  return (
    <aside className="">
      <div className="px-4 py-4 border-b border-gray-300">
        <h2 className="text-blue-500 font-medium">Properties</h2>
        <p>Heading</p>
      </div>
      <div className="space-y-7 px-6 py-6">
        {/* Font-size */}
        <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4">
          <label
            htmlFor="font-size"
            className="text-sm font-bold text-slate-600"
          >
            Size
          </label>
          <div className="grid grid-cols-[minmax(0,1fr)_42px]">
            <input
              id="font-size"
              type="number"
              className="h-11 w-full border border-r-0 border-slate-300 bg-white text-center
  text-[15px] font-semibold text-slate-900 outline-none"
              defaultValue={36}
            />
            <span
              className="grid h-11 place-items-center border border-slate-300 bg-blue-50
  text-sm font-bold text-slate-600"
            >
              px
            </span>
          </div>
        </div>

        {/* Font-weight */}
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
              defaultValue="700"
            >
              {FONT_WEIGHT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alignment */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-slate-600">
            Alignment
          </legend>
          <div className="grid w-full h-10 grid-cols-3 overflow-hidden rounded-[2px] border border-slate-300">
            <button
              type="button"
              aria-label="Align left"
              className="grid place-items-center border-r border-slate-300 bg-blue-50 text-slate-900"
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Align center"
              className="grid place-items-center border-r border-slate-300 bg-white text-slate-600"
            >
              <AlignCenter className="h-4 w-4" />
            </button>

            <button
              type="button"
              aria-label="Align right"
              className="grid place-items-center bg-white text-slate-600"
            >
              <AlignRight className="h-4 w-4" />
            </button>
          </div>
        </fieldset>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
