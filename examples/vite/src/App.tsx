import { useState } from "react";
import { AITextbox } from "@/components/ui/ai-textbox";
import { AITextarea } from "@/components/ui/ai-textarea";
import { AICombobox, type AIComboboxOption } from "@/components/ui/ai-combobox";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const COMBOBOX_OPTIONS: AIComboboxOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular" },
  { value: "solid", label: "SolidJS" },
  { value: "htmx", label: "HTMX" },
];

export default function ExamplePage() {
  const [textboxValue, setTextboxValue] = useState("");
  const [textboxOptionsValue, setTextboxOptionsValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [comboboxValue, setComboboxValue] = useState("");

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-bold">AI Input Components</h1>
        <p className="text-sm text-muted-foreground mt-1">
          shadcn/ui input components with AI generation, animated borders, and
          undo.
        </p>
      </div>

      {/* AITextbox — basic */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">AITextbox</h2>
        <p className="text-sm text-muted-foreground">
          Single-line input with AI generation button.
        </p>
        <AITextbox
          placeholder="Enter a product name..."
          value={textboxValue}
          onChange={(e) => setTextboxValue(e.target.value)}
          onAIClick={async () => {
            await sleep(1500);
            return "Quantum Flux Capacitor";
          }}
        />
      </section>

      {/* AITextbox — with dropdown options */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">AITextbox with Options</h2>
        <p className="text-sm text-muted-foreground">
          Dropdown variant with multiple AI actions.
        </p>
        <AITextbox
          placeholder="Enter a title..."
          value={textboxOptionsValue}
          onChange={(e) => setTextboxOptionsValue(e.target.value)}
          aiOptions={[
            { label: "Generate title", value: "generate" },
            { label: "Improve title", value: "improve" },
            { label: "Make shorter", value: "shorten" },
          ]}
          onAIClick={async (option) => {
            await sleep(1500);
            switch (option) {
              case "generate":
                return "How to Build AI-Powered React Components";
              case "improve":
                return "Building Next-Generation AI-Powered React Components";
              case "shorten":
                return "AI React Components";
              default:
                return "AI-Enhanced Input Components";
            }
          }}
        />
      </section>

      {/* AITextarea */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">AITextarea</h2>
        <p className="text-sm text-muted-foreground">
          Multi-line textarea with AI generation.
        </p>
        <AITextarea
          placeholder="Write a description..."
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          onAIClick={async () => {
            await sleep(2000);
            return "These AI-enhanced input components bring intelligent text generation directly into your forms. Each component features an animated gradient border during generation, a loading spinner, and a one-click undo to restore the previous value.";
          }}
        />
      </section>

      {/* AICombobox */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">AICombobox</h2>
        <p className="text-sm text-muted-foreground">
          Searchable dropdown with AI-powered selection.
        </p>
        <AICombobox
          options={COMBOBOX_OPTIONS}
          value={comboboxValue}
          onChange={setComboboxValue}
          placeholder="Pick a framework..."
          onAIClick={async () => {
            await sleep(1500);
            return "react";
          }}
        />
      </section>
    </div>
  );
}
