import type {
  ServerProvider,
  ServerProviderVersionAdvisory,
  ServerProviderCompatibilityAdvisory,
} from "@t3tools/contracts";
import { tr } from "~/i18n/tr";

export const PROVIDER_STATUS_STYLES = {
  disabled: {
    dot: "bg-muted-foreground/50",
  },
  error: {
    dot: "bg-destructive",
  },
  neutral: {
    dot: "bg-muted-foreground",
  },
  ready: {
    dot: "bg-success",
  },
  warning: {
    dot: "bg-warning",
  },
} as const;

export type ProviderStatusKey = keyof typeof PROVIDER_STATUS_STYLES;

// Antigravity's local health check verifies installation, not Google sign-in.
// API-key and Agent Platform warnings still need attention.
function isAntigravitySignInUnchecked(provider: ServerProvider): boolean {
  return (
    provider.driver === "antigravity" &&
    provider.installed &&
    provider.status === "warning" &&
    provider.auth.status === "unknown" &&
    (provider.auth.type === undefined ||
      provider.auth.type === "oauth-personal" ||
      provider.auth.type === "oauth-business")
  );
}

export function getProviderStatusKey(provider: ServerProvider | undefined): ProviderStatusKey {
  if (provider && !provider.enabled) return "disabled";
  if (provider && isAntigravitySignInUnchecked(provider)) return "neutral";
  return provider?.status ?? "warning";
}

function localizeProviderMessage(provider: ServerProvider): string | null {
  if (!provider.message) return null;
  return provider.message
    .replace(/(.+?) was not found on PATH\./g, "未在 PATH 中找到 $1。")
    .replace(
      /Could not start (.+?)\. Check Settings → Providers/g,
      "无法启动 $1。请检查设置 → 提供商",
    )
    .replace(/\bNot installed\b/g, "未安装")
    .replace(/\bNot authenticated\b/g, "未认证");
}

export function getProviderSummary(provider: ServerProvider | undefined) {
  if (!provider) {
    return {
      headline: tr("Checking provider status"),
      detail: tr("Waiting for the server to report installation and authentication details."),
    };
  }
  if (!provider.enabled || provider.status === "disabled") {
    return {
      headline: tr("Disabled"),
      detail: provider.message
        ? localizeProviderMessage(provider)
        : tr("此提供商已安装，但在 T3 Code 中已对新会话禁用。"),
    };
  }
  if (!provider.installed) {
    return {
      headline: tr("未找到"),
      detail: localizeProviderMessage(provider) ?? tr("未在 PATH 中检测到 CLI。"),
    };
  }
  if (provider.auth.status === "unauthenticated") {
    const authLabel = provider.auth.label ?? provider.auth.type;
    return {
      headline: authLabel ? `未认证 · ${authLabel}` : "未认证",
      detail: localizeProviderMessage(provider),
    };
  }
  if (isAntigravitySignInUnchecked(provider)) {
    return {
      headline: tr("已安装 · 未检查登录"),
      detail: localizeProviderMessage(provider),
    };
  }
  if (provider.status === "warning") {
    return {
      headline: tr("需要处理"),
      detail: provider.message
        ? localizeProviderMessage(provider)
        : tr("已安装提供商，但服务器无法完全验证它。"),
    };
  }
  if (provider.status === "error") {
    return {
      headline: tr("不可用"),
      detail: localizeProviderMessage(provider) ?? tr("提供商启动检查失败。"),
    };
  }
  if (provider.auth.status === "authenticated") {
    const authLabel = provider.auth.label ?? provider.auth.type;
    return {
      headline: authLabel ? `已认证 · ${authLabel}` : "已认证",
      detail: localizeProviderMessage(provider),
    };
  }
  return {
    headline: tr("可用"),
    detail: provider.message ?? null,
  };
}

export function getProviderVersionLabel(version: string | null | undefined) {
  if (!version) return null;
  const antigravity = /^agy_acp_server_(\d{4})(\d{2})(\d{2})_\d+(?:_(\w+))?$/.exec(version);
  if (antigravity) {
    const [, year, month, day, candidate] = antigravity;
    return `${year}-${month}-${day}${candidate ? ` ${candidate}` : ""}`;
  }
  return /^\d/.test(version) ? `v${version}` : version;
}

const COMPATIBILITY_TITLES = {
  graceful: "有限支持",
  unsupported: "不支持的版本",
  broken: tr("Known broken version"),
} as const;

export function getProviderVersionAdvisoryPresentation(
  advisory: ServerProviderVersionAdvisory | undefined,
  compatibility?: ServerProviderCompatibilityAdvisory | undefined,
  showCompatibility = true,
): {
  readonly title: string;
  readonly detail: string;
  readonly updateCommand: string | null;
  readonly emphasis: "normal" | "strong";
  readonly targetVersion: string | null;
} | null {
  const latestIsIncompatible =
    compatibility?.latestVersionStatus === "broken" ||
    compatibility?.latestVersionStatus === "unsupported";
  if (
    showCompatibility &&
    compatibility &&
    (compatibility.status === "graceful" ||
      compatibility.status === "unsupported" ||
      compatibility.status === "broken")
  ) {
    const targetVersion = compatibility.recommendedVersion;
    const recommendation = getProviderVersionLabel(targetVersion) ?? compatibility.recommendedRange;
    // Latest package versions cannot be updated into recommendations requiring another package.
    const isAlreadyLatest = advisory?.status === "current";
    return {
      title: COMPATIBILITY_TITLES[compatibility.status],
      detail:
        compatibility.message ??
        (recommendation
          ? `使用 ${recommendation} 以获得完整支持。`
          : tr("Update for full support.")),
      updateCommand:
        targetVersion || latestIsIncompatible || isAlreadyLatest
          ? null
          : (advisory?.updateCommand ?? null),
      emphasis: compatibility.status === "graceful" ? "normal" : "strong",
      targetVersion,
    };
  }
  if (
    !advisory ||
    advisory.status === "current" ||
    advisory.status === "unknown" ||
    latestIsIncompatible
  ) {
    return null;
  }

  const label = "有可用更新";
  const version = advisory.latestVersion;
  const versionLabel = getProviderVersionLabel(version);

  return {
    title: label,
    detail:
      advisory.message ??
      (versionLabel ? `${label}：安装 ${versionLabel}。` : `${label}：安装最新的提供商版本。`),
    updateCommand: advisory.updateCommand,
    emphasis: "normal" as const,
    targetVersion: null,
  };
}
