import type { TextGenerationPolicy } from "@t3tools/provider-core/server/textGenerationPolicy";

export const conventionalCommitsTextGenerationPolicy: TextGenerationPolicy = {
  kind: "conventional_commits",
  commitInstructions:
    "Use Conventional Commits when generating commit subjects. Prefer the narrowest accurate type and include a scope only when it is obvious from the diff. Write the description after the colon in Simplified Chinese; if the description is English, start it with a lowercase word rather than a proper noun or acronym because commitlint rejects a capitalized description.",
  changeRequestInstructions:
    "Use an English Conventional Commit type prefix followed by a colon and a concise Simplified Chinese description for the change request title, for example `feat: 增加自主陪伴活动`. Write the change request body in Simplified Chinese.",
  inferRepositoryConventions: false,
};

export const repositoryConventionsTextGenerationPolicy: TextGenerationPolicy = {
  kind: "repo_conventions",
  commitInstructions:
    "Follow the repository's established commit message style when examples are available.",
  changeRequestInstructions:
    "Follow the repository's established change request title and body style when examples are available.",
  inferRepositoryConventions: true,
};

export const customTextGenerationPolicy = (
  overrides: Omit<Partial<TextGenerationPolicy>, "kind">,
): TextGenerationPolicy => ({
  kind: "custom",
  inferRepositoryConventions: false,
  ...overrides,
});
