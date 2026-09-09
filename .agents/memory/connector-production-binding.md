---
name: Connector production identity
description: Production-only connector authentication failures in an autoscale deployment.
---

After adding or reconnecting an OAuth connector used by application code, publish a fresh deployment and test both development and production. If identical SDK calls succeed in development but repeatedly return HTTP 401 in production, treat it as a deployment-identity mapping failure rather than an API request-format or OAuth-scope problem.

**Why:** A Google Drive connector request succeeded through the development application runtime, while a freshly republished autoscale deployment repeatedly returned HTTP 401 on the first read-only Drive request. The connection remained healthy and no connector host/audience overrides existed.

**How to apply:** Verify with a read-only development request, inspect production logs, and confirm connector host/audience overrides are absent. If production still returns 401 after republishing, escalate the deployment identity-to-connection mapping or use a separately authenticated production integration.