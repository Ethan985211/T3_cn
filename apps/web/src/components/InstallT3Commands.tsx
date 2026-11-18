import { cn } from "~/lib/utils";

import { CommandBlock } from "./CommandBlock";
import { tr as translate } from "~/i18n/tr";

/**
 * Setup steps for another computer: install `t3`, then run `command`. Both installers are shown
 * because the browser showing this is often not the computer being set up.
 */
export function InstallT3Commands({
  command,
  className,
}: {
  readonly command: string;
  readonly className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs text-muted-foreground">{translate("macOS, Linux")}</p>
      <CommandBlock command="curl -fsSL https://t3.codes/install.sh | sh" />
      <p className="text-xs text-muted-foreground">Windows（PowerShell）</p>
      <CommandBlock command="irm https://t3.codes/install.ps1 | iex" />
      <p className="text-xs text-muted-foreground">{translate("Then")}</p>
      <CommandBlock command={command} />
      <p className="text-xs text-muted-foreground">
        {translate("Skip the install if you already have")}
        <code className="font-mono">t3</code>
        {translate(". If")} <code className="font-mono">t3</code>
        {translate(
          "is not found after installing, add the folder the\n        installer names to your PATH.",
        )}
      </p>
    </div>
  );
}
