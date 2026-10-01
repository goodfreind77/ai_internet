import app from "./app";
import { logger } from "./lib/logger";
import { importAuthorizedSourceTips } from "./lib/import-source-tips";
import { scheduleTipPublicationDates } from "./lib/schedule-tip-dates";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function startServer(): Promise<void> {
  try {
    await importAuthorizedSourceTips();
    await scheduleTipPublicationDates();
  } catch (err) {
    logger.error({ err }, "Tip content setup failed; refusing to start");
    process.exit(1);
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}

void startServer();
