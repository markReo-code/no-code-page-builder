"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

type FontSizeControlProps = {
  id?: string;
  value: number | undefined;
  disabled?: boolean;
  onChange: (value: number) => void;
};

const FONT_SIZE_OPTIONS = [12, 13, 14, 15, 16, 20, 24, 32, 36, 48, 64];

export const FontSizeControl = ({
  id,
  value,
  disabled,
  onChange,
}: FontSizeControlProps) => {
  const [inputValue, setInputValue] = useState(
    value == null ? "" : String(value),
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setInputValue(value == null ? "" : String(value));
  }, [value]);

  const commitValue = (nextValue: string) => {
    // 正規表現を使って、数字以外が含まれていたら、何もせず終了する
    if (!/^\d*$/.test(nextValue)) return;

    // 先頭の「0」を取り除く
    const normalizedValue = nextValue.replace(/^0+(?=\d)/, "");

    setInputValue(normalizedValue);

    // 「空」の状態でも入力中は許可する
    if (normalizedValue === "") return;

    // 文字列をnumberに変換する
    const numericValue = Number(normalizedValue);

    if (!Number.isFinite(numericValue)) return;
    if (numericValue < 1) return;

    onChange(numericValue);
  };

  const handleSelect = (nextValue: number) => {
    setInputValue(String(nextValue));
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="grid h-11 grid-cols-[minmax(0,1fr)_36px] border border-slate-300 bg-white">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={inputValue}
          disabled={disabled}
          onChange={(e) => commitValue(e.currentTarget.value)}
          onBlur={() => {
            if (inputValue === "") {
              setInputValue(value == null ? "" : String(value));
            }
          }}
          className="min-w-0 bg-white px-3 text-center text-[15px] font-semibold text-slate-900 outline-none disabled:bg-slate-50 disabled:text-slate-400"
        />
        <button
          type="button"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setIsOpen((current) => !current)}
          className="grid place-items-center border-l border-slate-300 bg-slate-50 text-slate-600 disabled:text-slate-300"
          aria-label="Select font-size"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {isOpen && !disabled && (
        <div
          className="absolute right-0 z-10 mt-1 max-h-64 w-full overflow-auto border border-slate-300 bg-slate-950
          py-1 text-white shadow-lg"
        >
          {FONT_SIZE_OPTIONS.map((option) => (
            <button
              type="button"
              key={option}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(option)}
              className="flex h-8 w-full items-center px-3 text-left text-sm hover:bg-blue-500"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
