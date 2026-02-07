import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Loader2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onAIClick?: () => void | Promise<void> | Promise<string>;
}

export const AITextarea = React.forwardRef<
  HTMLTextAreaElement,
  AITextareaProps
>(
  (
    { className, placeholder, disabled, onAIClick, value, onChange, ...props },
    ref,
  ) => {
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [showUndo, setShowUndo] = useState(false);
    const [previousValue, setPreviousValue] = useState<string>("");
    const animationRef = useRef<number | null>(null);
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

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
      const currentValue = internalRef.current?.value || "";
      setPreviousValue(currentValue);
      setShowUndo(false);

      setIsActive(true);
      setIsLoading(true);

      try {
        let generatedText: string | undefined;

        if (onAIClick) {
          const result = await onAIClick();
          if (typeof result === "string") {
            generatedText = result;
          }
        }

        // Set the generated text to the textarea if we got a result
        if (generatedText !== undefined && internalRef.current && onChange) {
          const syntheticEvent = {
            target: { value: generatedText },
            currentTarget: { value: generatedText },
          } as React.ChangeEvent<HTMLTextAreaElement>;

          internalRef.current.value = generatedText;
          onChange(syntheticEvent);
        }
      } finally {
        setIsLoading(false);
        setIsActive(false);
        setShowUndo(true);
      }
    };

    const handleUndo = () => {
      if (internalRef.current && onChange) {
        // Create a synthetic event to trigger onChange
        const syntheticEvent = {
          target: { value: previousValue },
          currentTarget: { value: previousValue },
        } as React.ChangeEvent<HTMLTextAreaElement>;

        internalRef.current.value = previousValue;
        onChange(syntheticEvent);
        setShowUndo(false);
      }
    };

    const handleRefCallback = (node: HTMLTextAreaElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

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
            "relative rounded-md bg-background shadow-xs transition-[color,box-shadow]",
            isActive
              ? "border border-transparent"
              : "border border-input focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          )}
        >
          <textarea
            ref={handleRefCallback}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={onChange}
            className={cn(
              "w-full min-h-[120px] bg-transparent text-base md:text-sm outline-none border-none px-3 py-2 placeholder:text-muted-foreground resize-none",
              className,
            )}
            {...props}
          />
          <div className="flex justify-end gap-1 px-1 pb-2">
            {showUndo && !disabled && (
              <button
                type="button"
                onClick={handleUndo}
                className="flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-all duration-200 hover:bg-accent text-gray-500 hover:text-gray-700"
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
                flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0
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
        </div>
      </div>
    );
  },
);

AITextarea.displayName = "AITextarea";
