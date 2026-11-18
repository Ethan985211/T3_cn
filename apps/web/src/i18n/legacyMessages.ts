// Historical server events were persisted in English before this build. Translate the
// few known human-readable sentences at render time so old threads read Chinese too.
const LEGACY_MESSAGES: Record<string, string> = {
  "Cancelled because the server restarted before the provider work completed.":
    "服务器重启，提供商任务未完成，已取消。",
  "Cancelled because the server shut down before the provider work completed.":
    "服务器关闭，提供商任务未完成，已取消。",
  "T3 Code restarted and resumed this turn": "T3 Code 已重启，并继续了本轮。",
  "T3 Code restarted and resumed this turn.": "T3 Code 已重启，并继续了本轮。",
};

export function translateLegacyMessage(message: string): string {
  const trimmed = message.trim();
  const direct = LEGACY_MESSAGES[trimmed] ?? LEGACY_MESSAGES[message];
  if (direct !== undefined) return direct;
  if (trimmed.startsWith("T3 Code restarted and resumed this turn")) {
    return "T3 Code 已重启，并继续了本轮。";
  }
  if (
    trimmed.startsWith("Cancelled because the server restarted before the provider work completed")
  ) {
    return "服务器重启，提供商任务未完成，已取消。";
  }
  if (
    trimmed.startsWith("Cancelled because the server shut down before the provider work completed")
  ) {
    return "服务器关闭，提供商任务未完成，已取消。";
  }
  return message;
}
