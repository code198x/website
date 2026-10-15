# Correct the Vault and pattern audit findings

Authorised scope: website issues #690–#693. Keep existing routes, architecture and review flags.

1. Correct AABB's missed diagonal and contracts in `src/content/patterns/cross-platform/physics/aabb-collision.mdx`. Use the existing shared pseudocode notation. Verify extracted published routines against independent occupied-cell/overlap oracles, grid edges and a missing-diagonal mutation with `verify_aabb.py`.
2. Correct the Bitmap Addressing timing and input/clobber contract in its existing pattern. Verify instruction accounting and valid next-line transitions against the bounded audit evidence; keep code illustrative.
3. Limit the NES lockout summary/body to front-loading consoles and omit VIC-II's unsupported end date. Check YAML and preserved review flags, then generated article/preview/date output.
4. Run focused checks and the production build after the four corrections. Inspect affected generated pages and links. Commit the issue-sized changes, push and open a focused PR. No dependencies, source migrations or unrelated cleanup.
