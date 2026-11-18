import zhSources from "./zh-sources.json";

// The catalog is generated from the wrapped UI strings (see scripts/i18n-build-zh.mjs).
// Lookups are keyed by the English source text, so a translated string is always a
// direct hit and there is no runtime hashing or async catalog load to race against.
const catalog: Record<string, string> = zhSources;

// Chinese is the product default for this fork, so module-level UI constants created at
// import time (label maps, placeholders) are already localised before settings load.
// `setTranslationLocale` still disables lookups when the user picks another language.
let chineseActive = true;

/** Called whenever the UI language setting changes. */
export function setTranslationLocale(locale: string): void {
  chineseActive = locale.toLowerCase().startsWith("zh");
}

export function isChineseActive(): boolean {
  return chineseActive;
}

/**
 * Translate a UI string. Falls back to the English source while the UI language is not
 * Chinese, or when the string has no entry in the catalog yet.
 */
export function tr(message: string): string {
  if (!chineseActive) return message;
  const value = catalog[message] ?? message;
  return value
    .replace(/(?<![\\/~])\bworktrees\b/gi, "工作树")
    .replace(/(?<![\\/~])\bworktree\b/gi, "工作树")
    .replace(/工作树\s+(位置|分支命名|设置|子模块)/g, "工作树$1");
}

/** Drop-in replacement for gt-react's `msg`: declares a translatable UI string. */
export const msg = tr;

/** Plain accessor for the translation function; not a React hook. */
export function getMessages(): (message: string) => string {
  return tr;
}

/** Plain accessor for the translation function; not a React hook. */
export function getGT(): (message: string) => string {
  return tr;
}
