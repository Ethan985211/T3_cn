import type { ThreadTitleRegenerationOutcome } from "@t3tools/contracts";
import {
  type AtomCommandResult,
  isAtomCommandInterrupted,
  squashAtomCommandFailure,
} from "@t3tools/client-runtime/state/runtime";

import { stackedThreadToast } from "./ui/toast";
import { tr } from "~/i18n/tr";

type TitleRegenerationResult = AtomCommandResult<ThreadTitleRegenerationOutcome | null, unknown>;

function failureMessage(result: TitleRegenerationResult): string | null {
  if (result._tag === "Failure") {
    if (isAtomCommandInterrupted(result)) return null;
    const error = squashAtomCommandFailure(result);
    return error instanceof Error ? error.message : tr("An error occurred.");
  }
  return result.value?.status === "failed"
    ? (result.value.message ?? tr("Title generation failed."))
    : null;
}

function isKept(result: TitleRegenerationResult): boolean {
  return result._tag === "Success" && result.value?.status === "unchanged";
}

export function titleRegenerationToast(results: ReadonlyArray<TitleRegenerationResult>) {
  const failures = results.flatMap((result) => {
    const message = failureMessage(result);
    return message === null ? [] : [message];
  });
  if (failures.length > 0) {
    return stackedThreadToast({
      type: "error",
      title:
        results.length === 1
          ? tr("Failed to regenerate thread title")
          : `Failed to regenerate ${failures.length} of ${results.length} thread titles`,
      description: failures[0],
    });
  }
  const kept = results.filter(isKept).length;
  if (kept === 0) return null;
  if (results.length === 1) {
    return stackedThreadToast({
      type: "info",
      title: tr("Title kept"),
      description: tr("The current title already fits this thread."),
    });
  }
  return stackedThreadToast({
    type: "info",
    title: kept === results.length ? "标题已保留" : `已保留 ${kept} / ${results.length} 个标题`,
    description:
      kept === results.length
        ? tr("The current titles already fit these threads.")
        : tr("Those titles already fit their threads."),
  });
}
