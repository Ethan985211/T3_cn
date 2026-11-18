import { tr } from "~/i18n/tr";
export const CODE_BLOCK_LANGUAGES = [
  { id: "", label: tr("Plain text") },
  { id: "asm", label: tr("Assembly") },
  { id: "bash", label: "Bash" },
  { id: "c", label: "C" },
  { id: "cpp", label: tr("C++") },
  { id: "csharp", label: tr("C#") },
  { id: "css", label: tr("CSS") },
  { id: "dart", label: tr("Dart") },
  { id: "diff", label: tr("Diff") },
  { id: "dockerfile", label: tr("Dockerfile") },
  { id: "elixir", label: tr("Elixir") },
  { id: "go", label: tr("Go") },
  { id: "graphql", label: tr("GraphQL") },
  { id: "haskell", label: tr("Haskell") },
  { id: "html", label: tr("HTML") },
  { id: "java", label: tr("Java") },
  { id: "javascript", label: tr("JavaScript") },
  { id: "json", label: "JSON" },
  { id: "jsx", label: tr("JSX") },
  { id: "kotlin", label: tr("Kotlin") },
  { id: "lua", label: tr("Lua") },
  { id: "markdown", label: tr("Markdown") },
  { id: "php", label: tr("PHP") },
  { id: "powershell", label: "PowerShell" },
  { id: "python", label: tr("Python") },
  { id: "r", label: "R" },
  { id: "ruby", label: tr("Ruby") },
  { id: "rust", label: tr("Rust") },
  { id: "scala", label: tr("Scala") },
  { id: "scss", label: tr("SCSS") },
  { id: "sql", label: "SQL" },
  { id: "svelte", label: tr("Svelte") },
  { id: "swift", label: tr("Swift") },
  { id: "toml", label: tr("TOML") },
  { id: "tsx", label: tr("TSX") },
  { id: "typescript", label: tr("TypeScript") },
  { id: "vue", label: tr("Vue") },
  { id: "xml", label: tr("XML") },
  { id: "yaml", label: tr("YAML") },
  { id: "zig", label: tr("Zig") },
] as const;

export type CodeBlockLanguage = { readonly id: string; readonly label: string };

const LANGUAGE_ALIASES: Record<string, string> = {
  assembly: "asm",
  cs: "csharp",
  "c++": "cpp",
  js: "javascript",
  md: "markdown",
  plaintext: "",
  py: "python",
  rb: "ruby",
  rs: "rust",
  s: "asm",
  sh: "bash",
  shell: "bash",
  text: "",
  ts: "typescript",
  txt: "",
  yml: "yaml",
};

export function languageOfInfoString(info: string): string {
  return info.trim().split(/\s+/, 1)[0] ?? "";
}

/** Plain text clears the language unless trailing metadata would be parsed as one. */
export function withInfoStringLanguage(info: string, language: string): string {
  const leading = /^\s*/.exec(info)![0];
  const rest = info.slice(leading.length + languageOfInfoString(info).length);
  if (language) return `${leading}${language}${rest}`;
  return rest.trim() ? `${leading}text${rest}` : "";
}

export function codeLanguageEntry(language: string): CodeBlockLanguage | null {
  const id = LANGUAGE_ALIASES[language.toLowerCase()] ?? language;
  return CODE_BLOCK_LANGUAGES.find((entry) => entry.id === id.toLowerCase()) ?? null;
}

export function codeLanguageLabel(language: string): string {
  return codeLanguageEntry(language)?.label ?? language;
}
