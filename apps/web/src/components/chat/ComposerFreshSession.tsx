import { EraserIcon } from "lucide-react";

import type { ComposerBannerStackItem } from "./ComposerBannerStack";
import { tr } from "~/i18n/tr";

/** Shown while `/clear` is armed; dismissing it keeps the current conversation. */
export function freshSessionBannerItem(onUndo: () => void): ComposerBannerStackItem {
  return {
    id: "fresh-session",
    variant: "info",
    icon: <EraserIcon />,
    title: tr("Your next message starts a fresh session"),
    description: tr("The agent won't see earlier messages in this thread."),
    dismissLabel: tr("Keep the current session"),
    onDismiss: onUndo,
  };
}
