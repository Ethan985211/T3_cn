import React from "react";

import { tr } from "./tr";

function translateNode(node: React.ReactNode): React.ReactNode {
  if (typeof node === "string") {
    return tr(node);
  }
  if (Array.isArray(node)) {
    return node.map(translateNode);
  }
  return node;
}

/** Drop-in replacement for gt-react's `<T>`: translates the literal text it wraps. */
export function T({ children }: { children?: React.ReactNode }): React.ReactElement {
  return <>{React.Children.map(children, translateNode)}</>;
}
