import { describe, expect, it } from "vite-plus/test";

import {
  buildCommitMessagePrompt,
  buildPrContentPrompt,
  buildThreadTitlePrompt,
} from "./textGenerationPrompts.ts";
import { normalizeCliError } from "./textGenerationUtils.ts";

describe("normalizeCliError", () => {
  it("does not expose CLI failure details in the public error message", () => {
    const result = normalizeCliError(
      "codex",
      "generateCommitMessage",
      new Error("request failed with access_token=secret-token"),
      "Failed to generate a commit message",
    );

    expect(result.detail).toBe("Failed to generate a commit message");
    expect(result.message).not.toContain("secret-token");
  });
});

describe("buildThreadTitlePrompt", () => {
  it("names the project to leave out and puts the user's instructions above the limits", () => {
    for (const previousTitle of [undefined, "Hyperdrive Config Crash"]) {
      const { prompt } = buildThreadTitlePrompt({
        message: "hyperdrive init crashes without a config",
        previousTitle,
        projectTitle: "Hyperdrive",
        instructions: "Prefix every title with the team name.",
      });
      expect(prompt).toContain('Never include the project name ("Hyperdrive")');
      expect(prompt).not.toContain("fewer than 40 characters");
      expect(prompt).toContain("Title instructions from the user:\nPrefix every title");
    }
    expect(buildThreadTitlePrompt({ message: "Fix login", instructions: " " }).prompt).toContain(
      "3-8 words, fewer than 40 characters.",
    );
  });
});

describe("Chinese commit and pull request prompts", () => {
  it("requires a Conventional Commit prefix and Simplified Chinese content", () => {
    const { prompt } = buildCommitMessagePrompt({
      branch: "feat/companion",
      stagedSummary: "M companion.ts",
      stagedPatch: "+const enabled = true;",
    });

    expect(prompt).toContain("Simplified Chinese");
    expect(prompt).toContain("feat: 增加自主陪伴活动");
    expect(prompt).toContain("Conventional Commit type prefix");
  });

  it("requires a Chinese PR title and Chinese body headings", () => {
    const { prompt } = buildPrContentPrompt({
      baseBranch: "main",
      headBranch: "feat/companion",
      commitSummary: "feat: 增加自主陪伴活动",
      diffSummary: "M companion.ts",
      diffPatch: "+const enabled = true;",
    });

    expect(prompt).toContain("Simplified Chinese");
    expect(prompt).toContain("feat: 增加自主陪伴活动");
    expect(prompt).toContain("## 摘要");
    expect(prompt).toContain("## 测试");
    expect(prompt).not.toContain("## Summary");
  });
});
