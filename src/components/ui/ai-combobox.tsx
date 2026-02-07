import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Loader2, Check, ChevronsUpDown, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIComboboxOption {
  value: string;
  label: string;
}

export interface AIComboboxProps {
  options: AIComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onAIClick?: () => void | Promise<void> | Promise<string>;
}

export const AICombobox = React.forwardRef<HTMLInputElement, AIComboboxProps>(
  (
    { options, value, onChange, placeholder, disabled, className, onAIClick },
    ref,
  ) => {
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [comboboxOpen, setComboboxOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [showUndo, setShowUndo] = useState(false);
    const [previousValue, setPreviousValue] = useState<string>("");
    const animationRef = useRef<number | null>(null);
    const internalRef = useRef<HTMLInputElement | null>(null);

    const gradientColors =
      "#BC82F3, #F5B9EA, #8D9FFF, #AA6EEE, #FF6778, #FFBA71, #C686FF, #BC82F3";

    useEffect(() => {
      if (isActive) {
        const animate = () => {
          setRotation((prev) => (prev + 2) % 360);
          animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setRotation(0);
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [isActive]);

    const handleAIClick = async () => {
      if (isLoading || disabled) return;

      // Store the current value before AI modification
      setPreviousValue(value || "");
      setShowUndo(false);

      setIsActive(true);
      setIsLoading(true);
      setComboboxOpen(false);

      try {
        let generatedText: string | undefined;

        if (onAIClick) {
          const result = await onAIClick();
          if (typeof result === "string") {
            generatedText = result;
          }
        }

        // Set the generated text if we got a result
        if (generatedText !== undefined && onChange) {
          onChange(generatedText);
        }
      } finally {
        setIsLoading(false);
        setIsActive(false);
        setShowUndo(true);
      }
    };

    const handleUndo = () => {
      if (onChange) {
        onChange(previousValue);
        setShowUndo(false);
      }
    };

    const handleRefCallback = (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()),
    );

    const selectedOption = options.find((opt) => opt.value === value);
    const displayValue = comboboxOpen
      ? searchValue
      : selectedOption?.label || "";

    return (
      <div
        className="relative rounded-md overflow-visible"
        style={{
          padding: "1px",
          background: isActive
            ? `conic-gradient(from ${rotation}deg, ${gradientColors})`
            : "transparent",
          transition: "padding 0.3s ease, background 0.3s ease",
          boxShadow: isActive
            ? `0 0 8px rgba(188, 130, 243, 0.35), 0 0 20px rgba(141, 159, 255, 0.15)`
            : "none",
        }}
      >
        <div
          className={cn(
            "relative flex h-9 w-full items-center rounded-md bg-background px-3 py-1 shadow-xs transition-[color,box-shadow]",
            isActive
              ? "border border-transparent"
              : "border border-input focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          )}
        >
          <input
            ref={handleRefCallback}
            type="text"
            value={displayValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setComboboxOpen(true);
            }}
            onFocus={() => {
              setSearchValue("");
              setComboboxOpen(true);
            }}
            onBlur={() => {
              // Delay to allow click on option
              setTimeout(() => setComboboxOpen(false), 200);
              setSearchValue("");
            }}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent text-base md:text-sm outline-none border-none placeholder:text-muted-foreground",
              className,
            )}
          />

          <button
            type="button"
            onClick={() => setComboboxOpen(!comboboxOpen)}
            disabled={disabled}
            className="flex items-center justify-center w-7 h-7 -mr-2 rounded-md flex-shrink-0 transition-all duration-200 hover:bg-accent text-gray-500 hover:text-gray-700"
          >
            <ChevronsUpDown className="w-4 h-4" />
          </button>

          {showUndo && !disabled && (
            <button
              type="button"
              onClick={handleUndo}
              className="flex items-center justify-center w-7 h-7 -mr-2 rounded-md flex-shrink-0 transition-all duration-200 hover:bg-accent text-gray-500 hover:text-gray-700"
              title="Undo AI changes"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleAIClick}
            disabled={isLoading || disabled}
            className={`
              flex items-center justify-center w-7 h-7 -mr-2 rounded-md flex-shrink-0
              transition-all duration-200
              ${
                isActive
                  ? "bg-purple-100 text-purple-600"
                  : "hover:bg-accent text-gray-500 hover:text-gray-700"
              }
              ${isLoading || disabled ? "cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </button>
        </div>

        {comboboxOpen && filteredOptions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  if (onChange) {
                    onChange(option.value);
                  }
                  setComboboxOpen(false);
                  setSearchValue("");
                }}
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent text-sm"
              >
                {option.label}
                {value === option.value && (
                  <Check className="w-4 h-4 text-purple-600" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

AICombobox.displayName = "AICombobox";
