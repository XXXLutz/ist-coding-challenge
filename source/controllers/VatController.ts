import { Request, Response } from "express";
import { VatService } from "../services/VatService.js";
import { vatValidator } from "../validators/VatValidator.js";

export default class VatController {
  private vatService: VatService;

  constructor() {
    this.vatService = new VatService();
  }

  async validateVat(req: Request, res: Response) {
    try {
      const { countryCode, vat } = vatValidator.parse(req.body);

      const isValid = await this.vatService.validateVat(countryCode, vat);

      res.json({
        validated: isValid,
        details: isValid
          ? "VAT number is valid for the given country code."
          : "Invalid VAT number.",
      });
    } catch (error: any) {
      if (error.message.includes("Invalid enum value")) {
        res.status(501).json({ error: "Unsupported country code" });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}