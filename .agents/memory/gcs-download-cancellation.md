---
name: GCS download cancellation
description: An observed Node 24 and Google Cloud Storage SDK cancellation race affecting public image delivery.
---

Verify browser cancellation when changing how Google Cloud Storage assets are served, not just successful downloads.

**Why:** With Node 24 and the GCS SDK 7.22, a browser closing during request setup could trigger an uncaught ERR_STREAM_UNABLE_TO_PIPE inside the SDK and terminate the API process, despite route and stream error handlers. A successful image response did not expose this failure.

**How to apply:** For small public images, bounded downloads independent of the browser response avoid premature SDK stream destruction. If introducing streaming or upgrading the SDK/runtime, explicitly check navigation away while concurrent downloads are still pending before relying on cancellation propagation.