import { Elysia } from "elysia";

import { logger } from "../lib/logger";

export const errorHandler = new Elysia({ name: "error-handler" }).onError(
  ({ code, error, set }) => {
    const message = error instanceof Error ? error.message : "Unknown error";

    logger.error("Request failed", { code, message });

    if (code === "VALIDATION") {
      set.status = 422;
      return {
        error: "Validation failed",
        message,
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        error: "Not found",
      };
    }

    set.status = 500;
    return {
      error: "Internal server error",
    };
  },
);
