#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$project_root"

check_file() {
  local path="$1" expected="$2" actual
  actual="$(shasum -a 256 "$path" | awk '{print $1}')"
  if [[ "$actual" != "$expected" ]]; then
    echo "FAIL  $path  expected=$expected actual=$actual"
    return 1
  fi
  echo "PASS  $path"
}

check_tree() {
  local path="$1" expected="$2" actual
  actual="$(find "$path" -type f -print0 | sort -z | xargs -0 shasum -a 256 | shasum -a 256 | awk '{print $1}')"
  if [[ "$actual" != "$expected" ]]; then
    echo "FAIL  $path/**  expected=$expected actual=$actual"
    return 1
  fi
  echo "PASS  $path/**"
}

check_tree "prototype" "448ecaa9cf4ff3c016d4af36d37ddd42c096446199001c1d10fcca3d7b5bdd55"
check_tree "Designs so far" "74894f36757286be63342eedb8dcea43536bbb3950a76aebcf13865aff0f8610"
check_tree "Jobseeker ATS Mukesh" "6a69e7badf01d3036e18840d79ba2474a4ca5f37ce1f84a4497a62e42292b753"
check_file "PROJECT_CONTEXT.md" "d692ca650ec2794f0bb9f090ff53d2a1f3b677056bd2bbd179ab588fece0c24c"
check_file "CLAUDE.md" "8a5f0361d95907f9f9a9bce65d747194ecf4041865c34d89f680ddcb4c08021c"
check_file "CEO_DEMO_BLUEPRINT.md" "edcd275e8639345c41fd8c408889760a84b19107db1f9f9834b65eaff2957287"

original_demo_hash="$(find ceo-demo \
  \( -path 'ceo-demo/node_modules' -o -path 'ceo-demo/dist' -o -path 'ceo-demo/output' -o -path 'ceo-demo/playwright-report' -o -path 'ceo-demo/test-results' -o -path 'ceo-demo/.playwright-cli' \) -prune \
  -o -type f -print0 | sort -z | xargs -0 shasum -a 256 | shasum -a 256 | awk '{print $1}')"
expected_original_demo_hash="b95d017d7fda952f6201a7327472c8cd56bcaf64452f68be5c5612a1cc7e52ee"
if [[ "$original_demo_hash" != "$expected_original_demo_hash" ]]; then
  echo "FAIL  ceo-demo/** clean source  expected=$expected_original_demo_hash actual=$original_demo_hash"
  exit 1
fi
echo "PASS  ceo-demo/** clean source"

agents_hash="$(shasum -a 256 AGENTS.md | awk '{print $1}')"
echo "INFO  AGENTS.md externally managed; current=$agents_hash"
