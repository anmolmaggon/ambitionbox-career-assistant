# Preservation Manifest

Baseline recorded before CEO demo implementation on 2026-08-06.

## Frozen roots

| Path | SHA-256 aggregate |
| --- | --- |
| `prototype/**` | `448ecaa9cf4ff3c016d4af36d37ddd42c096446199001c1d10fcca3d7b5bdd55` |
| `Designs so far/**` | `74894f36757286be63342eedb8dcea43536bbb3950a76aebcf13865aff0f8610` |
| `Jobseeker ATS Mukesh/**` | `6a69e7badf01d3036e18840d79ba2474a4ca5f37ce1f84a4497a62e42292b753` |

Aggregate hashes are calculated from the sorted list of per-file SHA-256 hashes.

## Frozen root files

| Path | SHA-256 |
| --- | --- |
| `PROJECT_CONTEXT.md` | `d692ca650ec2794f0bb9f090ff53d2a1f3b677056bd2bbd179ab588fece0c24c` |
| `CLAUDE.md` | `8a5f0361d95907f9f9a9bce65d747194ecf4041865c34d89f680ddcb4c08021c` |
| `AGENTS.md` | `c3ee5f0f520a19d8b18aff07c7b4ec08d297fbe570511de3819ed909f35b40f5` (original observation) |
| `CEO_DEMO_BLUEPRINT.md` | `edcd275e8639345c41fd8c408889760a84b19107db1f9f9834b65eaff2957287` |

All paths outside `ceo-demo/` are read-only references for this build.

## Environment-managed exception

Root `AGENTS.md` is refreshed automatically by the Claude Memory environment. At 2026-08-06 17:48:56 +0530 it changed to `90ed2d1119ca98862a2ac0a25550a22f78f1f015d964ee6c62d0e060535427c4` without being targeted by this build. The user approved treating it as externally managed. The demo build will never edit it; future automatic changes are logged but do not block implementation.

- 2026-08-06 18:39:53 +0530 — automatic refresh observed at `f54de48173d797cad596a27158667cc72dcf436dc761259891176c8968ae781c`.
