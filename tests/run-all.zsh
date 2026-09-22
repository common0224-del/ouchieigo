#!/bin/zsh
set -eu

project_dir="${0:A:h:h}"
cd "$project_dir"

runtime_root="/Users/y.komon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node"
node_bin="$runtime_root/bin/node"
node_modules="$runtime_root/node_modules"
chrome_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [[ ! -x "$node_bin" ]]; then node_bin="$(command -v node)"; fi
NODE_PATH="$node_modules" CHROME_PATH="$chrome_path" "$node_bin" tests/check-image-alpha.mjs

zsh tests/run-listen-drag-recovery.zsh
zsh tests/run-layout-check.zsh
