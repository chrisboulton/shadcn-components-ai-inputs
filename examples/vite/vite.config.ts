import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { existsSync } from "fs";

// Resolves @/ imports with a layered approach:
//   @/components/ui/* → check local example dir first, then library src
//   @/* → library src
function resolveAliases(): Plugin {
  const localUiDir = path.resolve(__dirname, "src/components/ui");
  const libSrc = path.resolve(__dirname, "../../src");

  return {
    name: "resolve-aliases",
    enforce: "pre",
    resolveId(source) {
      if (!source.startsWith("@/")) return null;
      const subpath = source.slice(2);

      // For UI components, check local example dir first
      if (subpath.startsWith("components/ui/")) {
        const name = subpath.slice("components/ui/".length);
        for (const ext of [".tsx", ".ts"]) {
          const localPath = path.join(localUiDir, name + ext);
          if (existsSync(localPath)) return localPath;
        }
      }

      // Fall back to library src
      for (const ext of [".tsx", ".ts"]) {
        const libPath = path.join(libSrc, subpath + ext);
        if (existsSync(libPath)) return libPath;
      }

      return null;
    },
  };
}

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [resolveAliases(), react(), tailwindcss()],
});
