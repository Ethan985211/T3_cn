import type { ReactNode } from "react";

export function DraftHeroProjectHeading({
  children,
}: {
  children: ReactNode;
  projectName: string;
}) {
  return (
    <h1 className="flex w-full flex-wrap items-baseline justify-center gap-x-2 gap-y-1 text-center font-normal text-2xl text-foreground tracking-tight sm:text-3xl">
      <span className="shrink-0">我们该在</span>
      <span className="min-w-0 max-w-full break-words">{children} 中构建什么？</span>
    </h1>
  );
}
