import express from "express";
import type { IncomingMessage, ServerResponse } from "http";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const ready = (async () => {
  await registerRoutes(app);
})();

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  await ready;
  return (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(
    req,
    res,
  );
}
