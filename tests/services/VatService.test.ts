import { VatService } from "../../source/services/VatService";

describe("VatService", () => {
    let vatService: VatService;

    beforeEach(() => {
        vatService = new VatService();
    });


    it("should validate a valid Austrian VAT number", async () => {
        const result = await vatService.validateVat("AT", "U18522105");
        expect(result).toBe(true);
    });

    it("should validate a valid German VAT number", async () => {
        const vatService = new VatService();
        const result = await vatService.validateVat("DE", "321281763");
        expect(result).toBe(true);
    });

    it("should validate a valid Dutch VAT number", async () => {
        const vatService = new VatService();
        const result = await vatService.validateVat("NL", "803441526B01");
        expect(result).toBe(true);
    });

    it("should validate a valid Dutch VAT number with prefix", async () => {
        const vatService = new VatService();
        const result = await vatService.validateVat("NL", "NL803441526B01");
        expect(result).toBe(true);
    });

    it('should validate a valid Swiss VAT number', async () => {
        const isValid = await vatService.validateVat('CH', 'CHE-116.267.986');
        expect(isValid).toBe(true);
    });

    it('should invalidate an invalid Swiss VAT number', async () => {
        const isValid = await vatService.validateVat('CH', 'CHE-000.000.000');
        expect(isValid).toBe(false);
    });
});

