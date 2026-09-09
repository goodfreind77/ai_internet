---
name: Connector production binding
description: Production deployment behavior after adding or changing an OAuth connector.
---

After adding or reconnecting an OAuth connector used by application code, publish a fresh deployment before testing the integration on the live domain.

**Why:** A Google Drive connector request succeeded through the development application runtime while the existing production deployment returned HTTP 401. The deployment had not incorporated the newly attached connection.

**How to apply:** Verify the connector with a read-only request in development, republish, and then test the live integration. Do not treat a production-only 401 as an API request-format failure when development succeeds with the same SDK call.