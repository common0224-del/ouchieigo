#!/bin/zsh
set -eu

project_dir="${0:A:h:h}"
cd "$project_dir"

zsh tests/run-listen-drag-recovery.zsh
zsh tests/run-layout-check.zsh
