import { i18n, type DiffsMessages } from "@pierre/diffs";

/**
 * The @pierre/diffs renderer owns a handful of strings that never pass through
 * the app's `tr()` catalog: collapsed-context rows, search controls, and merge
 * conflict actions. Keep them in sync with the app locale here.
 */
const ZH_DIFF_MESSAGES: Partial<DiffsMessages> = {
  unmodifiedLines: "{count} 行未修改",
  unknownUnmodifiedLines: "更多未修改行",
  expandAll: "展开全部",
  noNewlineAtEndOfFile: "文件末尾无换行",
  acceptCurrentChange: "保留当前更改",
  acceptIncomingChange: "保留传入更改",
  acceptBoth: "保留双方",
  searchPlaceholder: "搜索",
  replacePlaceholder: "替换",
  noSearchResults: "无搜索结果",
  searchResultCount: "{count} 个结果",
  searchResultPosition: "第 {index} 个结果，共 {count} 个",
  matchCase: "匹配大小写",
  wholeWord: "全词匹配",
  regularExpression: "正则表达式",
  replaceMatch: "替换",
  replaceAllMatches: "全部替换",
  previousMatch: "上一个结果",
  nextMatch: "下一个结果",
  closeSearch: "关闭搜索",
  toggleReplace: "切换替换栏",
};

export function applyDiffLocale(locale: string): void {
  if (locale.toLowerCase().startsWith("zh")) {
    i18n.set({ locale: "zh-CN", messages: ZH_DIFF_MESSAGES });
    return;
  }
  i18n.set({ locale: "en" });
}
