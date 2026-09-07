---
name: Managed content compatibility
description: Why database-managed reviews and tips coexist with legacy hardcoded content during migration.
---

Database-managed reviews and tips should be shown ahead of legacy hardcoded entries, while legacy detail renderers remain available until their rich content has been fully migrated.

**Why:** Existing tip detail pages contain custom rich React layouts that cannot be converted safely to plain text in one step. Removing them would break current public URLs and presentation.

**How to apply:** New content and publishing controls use the database APIs. Preserve legacy fallback lookups until a dedicated migration converts every existing review and rich tip into an editable content model.