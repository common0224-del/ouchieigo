#!/bin/zsh
set -u

project_dir="${0:A:h:h}"
cd "$project_dir"

runtime_root="/Users/y.komon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node"
node_bin="$runtime_root/bin/node"
node_modules="$runtime_root/node_modules"
chrome_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [[ ! -x "$node_bin" ]]; then node_bin="$(command -v node)"; fi
suite_result=0
NODE_PATH="$node_modules" CHROME_PATH="$chrome_path" "$node_bin" tests/check-image-alpha.mjs || suite_result=1
"$node_bin" tests/item-match-data.mjs || suite_result=1
"$node_bin" tests/item-match-combo.mjs || suite_result=1
"$node_bin" tests/action-match-data.mjs || suite_result=1
"$node_bin" tests/shopping-data.mjs || suite_result=1
"$node_bin" tests/shopping-screen.mjs || suite_result=1
"$node_bin" tests/listen-uniform-selection.mjs || suite_result=1
"$node_bin" tests/entrance-scene.mjs || suite_result=1
"$node_bin" tests/breakfast-drop-zones.mjs || suite_result=1
"$node_bin" tests/place-thumbnails-static.mjs || suite_result=1
"$node_bin" tests/ui-polish-static.mjs || suite_result=1
zsh tests/run-listen-drag-recovery.zsh || suite_result=1
zsh tests/run-layout-check.zsh || suite_result=1
zsh tests/run-think-and-say.zsh || suite_result=1
exit "$suite_result"
