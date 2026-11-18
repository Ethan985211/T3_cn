import * as NodeFS from "node:fs";
import * as NodePath from "node:path";
import * as NodeCrypto from "node:crypto";

// GT's `t("...")` resolves plain strings through the ICU catalog, so keys are ICU ids.
// The STRING id is emitted too for any `msg`-encoded lookups.
const sha = (obj) =>
  NodeCrypto.createHash("sha256").update(JSON.stringify(obj), "utf8").digest("hex").slice(0, 16);
const icuId = (source) => sha({ dataFormat: "ICU", source });
const stringId = (source) => sha({ dataFormat: "STRING", source });

const root = process.argv[2];
const sourcesPath = NodePath.resolve("scripts/i18n-wrapped-sources.json");
const dictPaths = NodeFS.readdirSync(NodePath.resolve("apps/web/i18n"))
  .filter((f) => f.startsWith("zh-") && f.endsWith(".json"))
  .sort();

const sources = JSON.parse(NodeFS.readFileSync(sourcesPath, "utf8"));
const dictionary = {};
for (const f of dictPaths)
  Object.assign(
    dictionary,
    JSON.parse(NodeFS.readFileSync(NodePath.resolve("apps/web/i18n", f), "utf8")),
  );

// Index-based translation parts: each file covers a contiguous slice of the source list,
// so the English keys never have to be retyped (and cannot drift).
const partsDir = NodePath.resolve("apps/web/i18n/parts");
if (NodeFS.existsSync(partsDir)) {
  for (const f of NodeFS.readdirSync(partsDir).filter((n) => n.endsWith(".json"))) {
    const part = JSON.parse(NodeFS.readFileSync(NodePath.join(partsDir, f), "utf8"));
    part.values.forEach((zh, i) => {
      if (!zh) return;
      const source = sources[part.start + i];
      if (source === undefined)
        throw new Error(`${f}: index ${part.start + i} past end of source list`);
      dictionary[source] = zh;
    });
  }
}

const outPath = NodePath.join(root, "src/i18n/translations/zh.json");
const existing = JSON.parse(NodeFS.readFileSync(outPath, "utf8"));
const out = { ...existing };

// Non-TSX UI copy (settings registries, label maps, status helpers) is translated from an
// explicit keyed catalog so the English keys come straight from the scan.
const tsDictPath = NodePath.resolve("apps/web/i18n/ts-zh.json");
const extraSources = [];
if (NodeFS.existsSync(tsDictPath)) {
  const tsDict = JSON.parse(NodeFS.readFileSync(tsDictPath, "utf8"));
  for (const [source, zh] of Object.entries(tsDict)) {
    if (!zh) continue;
    dictionary[source] = zh;
    extraSources.push(source);
  }
}

const allSources = [...sources, ...extraSources.filter((s) => !sources.includes(s))];
// Keyed dictionaries added after the TSX wrap (conditional expressions, template fragments)
// also need to reach the runtime source map, not only translations/zh.json.
for (const source of Object.keys(dictionary)) {
  if (dictionary[source] && !allSources.includes(source)) allSources.push(source);
}

let missing = 0;
const sourceMap = {};
for (const source of allSources) {
  const zh = dictionary[source];
  if (!zh) {
    missing += 1;
    continue;
  }
  sourceMap[source] = zh;
  out[icuId(source)] = zh;
  out[stringId(source)] = zh;
}

NodeFS.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
NodeFS.writeFileSync(
  NodePath.join(root, "src/i18n/zh-sources.json"),
  `${JSON.stringify(sourceMap, null, 2)}\n`,
  "utf8",
);
console.log(
  `sources=${allSources.length} (+${extraSources.length} non-tsx) translated=${allSources.length - missing} missing=${missing} entries=${Object.keys(out).length}`,
);
console.log("dictionary files:", dictPaths.join(", ") || "(none)");
