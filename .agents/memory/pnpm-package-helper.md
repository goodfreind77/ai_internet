---
name: Workspace package installation
description: Package helper behavior in the pnpm monorepo.
---

The language-package installation helper may attempt to add a dependency at the pnpm workspace root even when a package directory is supplied; pnpm then blocks the install with a root-add warning.

**Why:** The helper did not honor a per-package working-directory argument during a dependency attempt in this workspace.

**How to apply:** Before adding a dependency to a leaf package, check whether an existing workspace dependency or a small local validation function is sufficient. Do not assume a helper's working-directory argument targets the package; confirm its actual output.