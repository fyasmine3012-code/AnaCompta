import serverless from "serverless-http";
import { app } from "../../server.ts";

const handler = serverless(app);

export { handler };
