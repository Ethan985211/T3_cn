import { isChineseActive } from "./tr";

const ACTION_PATTERNS: ReadonlyArray<readonly [RegExp, string]> = [
  [/Stopped watching (\d+) pull requests?/gi, "已停止关注 $1 个拉取请求"],
  [/Watching (\d+) pull requests?/gi, "正在关注 $1 个拉取请求"],
  [/Unlinked (\d+) pull requests?/gi, "已取消关联 $1 个拉取请求"],
  [/Linked (\d+) pull requests?/gi, "已关联 $1 个拉取请求"],
  [/Checked linked pull requests (\d+) times/gi, "检查了 $1 次关联的拉取请求"],
  [/Checked linked pull requests/gi, "检查了关联的拉取请求"],
  [/Read (\d+) files?/gi, "读取了 $1 个文件"],
  [/Changed (\d+) files?/gi, "修改了 $1 个文件"],
  [/Ran (\d+) commands?/gi, "执行了 $1 条命令"],
  [/Created (\d+) threads?/gi, "创建了 $1 个会话"],
  [/Used device controls (\d+) times?/gi, "使用了 $1 次设备控制"],
  [/Used browser (\d+) times?/gi, "使用了 $1 次浏览器"],
  [/Searched the web (\d+) times?/gi, "搜索网络 $1 次"],
  [/Searched code (\d+) times?/gi, "搜索代码 $1 次"],
  [/Used (\d+) tools?/gi, "使用了 $1 个工具"],
  [/Received (\d+) updates?/gi, "收到 $1 条更新"],
  [/Performed (\d+) other actions?/gi, "执行了 $1 项其他操作"],
  [/Thought \(×(\d+)\)/gi, "思考（×$1）"],
  [/Thought/gi, "思考"],
  [/Used ([\w .@/-]+?) integrations?/gi, "使用了 $1 集成"],
];

/** Translate the English sentences produced by client-runtime's summarizeToolGroup. */
export function translateWorkLogSummary(summary: string): string {
  if (!isChineseActive()) return summary;
  let result = summary.trim();
  for (const [pattern, replacement] of ACTION_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result
    .replace(/, and /g, "，并")
    .replace(/ and /g, "并")
    .replace(/, /g, "、");
}

/**
 * Translate a single work-log label. The group summary is handled above; this
 * covers the English fallbacks that individual tool rows use before a group is
 * formed.
 */
export function translateWorkLogLabel(label: string): string {
  if (!isChineseActive()) return label;
  const direct: Record<string, string> = {
    "Read file": "读取文件",
    "Web search": "网络搜索",
    Thought: "思考",
    "Compacting context": "正在压缩上下文",
    "Context compacted": "上下文已压缩",
    "Context compaction failed": "上下文压缩失败",
    "Context compaction stopped": "上下文压缩已停止",
  };
  const translated = direct[label.trim()];
  if (translated !== undefined) return translated;
  const summary = translateWorkLogSummary(label);
  if (summary !== label) return summary;
  const compacted = /^Context compacted (.+) → (.+) tokens$/.exec(label.trim());
  if (compacted) return `上下文已压缩 ${compacted[1]} → ${compacted[2]} tokens`;
  return label;
}
