---
name: Consultation and application duplicate scope
description: Why short-term duplicate submission checks are separate for each customer journey.
---

Treat homepage quote inquiries, landing-page inquiries, and full signup applications as separate submission types when blocking short-term repeats. Normalize phone formatting before comparison, and use a 10-minute window within the same submission type.

**Why:** A customer may legitimately request a quote and then complete a signup application shortly afterward. Blocking across those two flows would lose an intentional application.

**How to apply:** Keep future duplicate checks scoped to the type of request. For landing pages, preserve the page-specific scope so a visitor can inquire about different offers; do not globally deduplicate by phone without a product decision.