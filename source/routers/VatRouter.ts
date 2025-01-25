import { Router } from "express";
import VatController from "../controllers/VatController.js";

export function createVatRouter(): Router {
  const router = Router();
  const controller = new VatController();

  router.post('/validate', (req, res) => controller.validateVat(req, res));

  return router;
}
