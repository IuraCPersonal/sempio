import { serve } from "@hono/node-server";
import * as dotenv from "dotenv";
import { Hono } from "hono";
import { parseArgs } from "node:util";

dotenv.config({ path: [".env.local", ".env"] });

const { positionals } = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
});

const cmd = positionals[0];

switch (cmd) {
  case "dev":
    console.log("Starting dev");
    await runDev();
    break;
  default:
    if (cmd) {
      console.error("Unknown command:", cmd);
    }
    break;
}

async function runDev() {
  const app = new Hono();

  app.get("/", (c) => c.text("Hello Node.js!"));

  serve(app);
}
