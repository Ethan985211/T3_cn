import type { ServerProcessSignal } from "@t3tools/contracts";

import { InlineButton } from "../ui/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
import { tr as translate } from "~/i18n/tr";

export function ProcessSignalActions({
  disabled,
  onSignal,
}: {
  disabled: boolean;
  onSignal: (signal: ServerProcessSignal) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Tooltip>
        <TooltipTrigger
          render={
            <InlineButton
              disabled={disabled}
              aria-label={translate("Send SIGINT")}
              tone="muted"
              onClick={() => onSignal("SIGINT")}
            >
              {translate("INT")}
            </InlineButton>
          }
        />
        <TooltipPopup side="top">{translate("Send SIGINT")}</TooltipPopup>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <InlineButton
              disabled={disabled}
              aria-label={translate("Send SIGKILL")}
              tone="destructive"
              onClick={() => onSignal("SIGKILL")}
            >
              {translate("KILL")}
            </InlineButton>
          }
        />
        <TooltipPopup side="top">{translate("Send SIGKILL")}</TooltipPopup>
      </Tooltip>
    </div>
  );
}
