import { isListedThreadLineage } from "@t3tools/contracts";

import type { EnvironmentProject, EnvironmentThreadShell } from "./models.ts";

export function planProjectRemoval<
  Thread extends Pick<EnvironmentThreadShell, "environmentId" | "projectId" | "lineage">,
>(options: {
  readonly members: ReadonlyArray<
    Pick<EnvironmentProject, "id" | "environmentId" | "title" | "workspaceRoot"> & {
      readonly environmentLabel?: string | null;
    }
  >;
  readonly groupMemberCount: number;
  readonly hasOtherMembers: boolean;
  readonly displayName: string;
  readonly threads: ReadonlyArray<Thread>;
  /** The members' threads this client does not hold: older settled threads its shell left out. */
  readonly unloadedThreadCount?: number;
}) {
  const { members, groupMemberCount, hasOtherMembers, displayName, threads } = options;
  const memberKeys = new Set(members.map((member) => `${member.environmentId}:${member.id}`));
  const projectThreads = threads.filter((thread) =>
    memberKeys.has(`${thread.environmentId}:${thread.projectId}`),
  );
  // Side chats and subagents go with their parent but never show in thread lists.
  const threadCount =
    projectThreads.filter((thread) => isListedThreadLineage(thread.lineage)).length +
    (options.unloadedThreadCount ?? 0);
  const isWholeGroup = members.length === groupMemberCount;
  const targetKind = hasOtherMembers || !isWholeGroup ? "checkout" : "project";
  const singleMember = members.length === 1 ? members[0]! : null;
  const targetLabel = singleMember?.title ?? displayName;
  const targetKindLabel = targetKind === "project" ? "项目" : "检出";
  const confirmationMessage = [
    threadCount > 0
      ? `移除${targetKindLabel}“${targetLabel}”并删除其 ${threadCount} 个会话？`
      : `移除${targetKindLabel}“${targetLabel}”？`,
    ...(singleMember
      ? [
          `路径：${singleMember.workspaceRoot}`,
          ...(singleMember.environmentLabel ? [`环境：${singleMember.environmentLabel}`] : []),
        ]
      : [`这会移除 ${members.length} 个分组项目条目。`]),
    ...(threadCount > 0
      ? ["这些会话及任何已归档会话将从 T3 Code 中删除。提供商会话会保留。"]
      : ["任何已归档会话将从 T3 Code 中删除。提供商会话会保留。"]),
    isWholeGroup && !hasOtherMembers
      ? "这只会移除项目条目，不会删除磁盘上的文件。"
      : "此分组项目中的其他条目不受影响。",
    "此操作无法撤销。",
  ].join("\n");

  return { projectThreads, isWholeGroup, targetKind, confirmationMessage };
}
