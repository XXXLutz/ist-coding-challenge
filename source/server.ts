import express, { Express, Router, json } from "express";
import responseTime from "response-time";
import Helmet from "helmet";
import { createVatRouter } from "./routers/VatRouter.js";
import { Configuration } from "./models/ConfigurationModel.js";

export default function createApp(configuration: Configuration): {
  app: Express;
  router: Router;
} {
  const app: Express = express();

  app.use(Helmet());
  app.use(json());
  app.use(responseTime({ suffix: true }));

  const router = createVatRouter();
  app.use("/api/vat", router);
  return { app, router };
}
