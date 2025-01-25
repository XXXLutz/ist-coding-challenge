import request from "supertest";
import createApp from "../../source/server";
import { Configuration } from "../../source/models/ConfigurationModel";

const configuration: Configuration = {
    port: 3333,
    expressServerOptions: {
        keepAliveTimeout: 5000,
        maxHeadersCount: 1000,
        maxConnections: 100,
        headersTimeout: 60000,
        requestTimeout: 60000,
        timeout: 60000,
    },
};

const { app } = createApp(configuration);


describe("VAT API", () => {
    it('should validate a valid Austrian VAT number', async () => {
        const response = await request(app)
            .post('/api/vat/validate')
            .send({ countryCode: 'AT', vat: 'U18522105' });

        expect(response.status).toBe(200);
        expect(response.body.validated).toBe(true);
    });

    it('should validate a valid Swiss VAT number', async () => {
        const response = await request(app)
            .post('/api/vat/validate')
            .send({ countryCode: 'CH', vat: 'CHE-116.267.986' });

        expect(response.status).toBe(200);
        expect(response.body.validated).toBe(true);
    });

    it('should return 400 for invalid Swiss VAT number', async () => {
        const response = await request(app)
            .post('/api/vat/validate')
            .send({ countryCode: 'CH', vat: 'CHE-116.267.00' });

        expect(response.status).toBe(400);
    });

    
    it('should return 200 and validated false for an invalid VAT number', async () => {
        const response = await request(app)
            .post('/api/vat/validate')
            .send({ countryCode: 'AT', vat: 'U12345678' });

        expect(response.status).toBe(200);
        expect(response.body.validated).toBe(false);
    });

    it('should return 400 for an invalid VAT number (less than 8 digits)', async () => {
        const response = await request(app)
            .post('/api/vat/validate')
            .send({ countryCode: 'AT', vat: 'U1234567' });

        expect(response.status).toBe(400);
    });

    it('should return 501 for unsupported country code', async () => {
        const response = await request(app)
            .post('/api/vat/validate')
            .send({ countryCode: 'ZZ', vat: '12345678' });

        expect(response.status).toBe(501);
    });
});

