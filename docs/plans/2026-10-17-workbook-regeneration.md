# One-command workbook regeneration

Use the existing Astro/Playwright pipeline without new dependencies or changed workbook content.

1. Add `scripts/regenerate-first-workbook.mjs` and `npm run workbook:build`: build fresh HTML, serve the built files on a loopback ephemeral port, run the existing PDF generator, copy the successful PDFs/manifest into dist, and close the server in finally.
2. Stage both generated editions before replacing published files; read the manifest version from sources.json. Keep the existing --base-url command for advanced use.
3. Replace the multi-terminal README instructions with the command, editable source locations, prerequisites and review/publish steps. Add the command to the main README.
4. Run the full command with prepared existing runtime inputs; check both generated PDFs/page counts/text and manifest hashes. Exercise a deliberately overflowing teacher page and confirm failure leaves both previous PDFs/manifest unchanged. Restore published PDFs after the regeneration test because workbook content is unchanged.
5. Commit and push the tooling/docs change, open a PR and merge after checks. Remove task previews/build caches/worktree after verifying retention on main.
