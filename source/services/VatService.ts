import { IncomingMessage } from "http";
import { request } from "https";

export class VatService {
    async validateVat(countryCode: string, vat: string): Promise<boolean> {
        if (countryCode === "CH") {
            return this.validateSwiss(vat);
        } else {
            return this.validateEU(countryCode, vat);
        }
    }

    private stripCountryCodePrefix(countryCode: string, vatNumber: string): string {
      const prefix = countryCode.toUpperCase();
      const vatUpper = vatNumber.toUpperCase();
  
      if (vatUpper.startsWith(prefix)) {
        return vatNumber.slice(prefix.length);
      }
  
      return vatNumber;
    }

    private async validateEU(countryCode: string, vat: string): Promise<boolean> {
      const normalizedVat = this.stripCountryCodePrefix(countryCode, vat);
        const postData = JSON.stringify({
            countryCode: countryCode,
            vatNumber: normalizedVat
        });

        const options = {
            hostname: 'ec.europa.eu',
            path: '/taxation_customs/vies/rest-api/check-vat-number',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        return new Promise((resolve, reject) => {
            const req = request(options, (res: IncomingMessage) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        resolve(response.valid);
                    } catch (error) {
                        reject(new Error('Invalid response from EU VAT service'));
                    }
                });
            });

            req.on('error', (e) => {
                reject(e);
            });

            req.write(postData);
            req.end();
        });
    }

    private async validateSwiss(vat: string): Promise<boolean> {
        const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:uid="http://www.uid.admin.ch/xmlns/uid-wse">
          <soap:Header/>
          <soap:Body>
            <uid:ValidateVatNumber>
              <uid:vatNumber>${vat}</uid:vatNumber>
            </uid:ValidateVatNumber>
          </soap:Body>
        </soap:Envelope>`;
    
        const options = {
          hostname: "www.uid-wse-a.admin.ch",
          path: "/V5.0/PublicServices.svc",
          method: "POST",
          headers: {
            "Content-Type": "text/xml; charset=utf-8",
            "Content-Length": Buffer.byteLength(soapEnvelope),
            "SOAPAction": "http://www.uid.admin.ch/xmlns/uid-wse/IPublicServices/ValidateVatNumber"
          }
        };
    
        return new Promise((resolve, reject) => {
          const req = request(options, (res: IncomingMessage) => {
            let data = "";
            res.setEncoding("utf8");
            
            res.on("data", (chunk) => {
              data += chunk;
            });
    
            res.on("end", () => {
              if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                try {
                  // Parse SOAP response using regex to extract the validation result
                  const regex = /<ValidateVatNumberResult>(true|false)<\/ValidateVatNumberResult>/i;
                  const match = data.match(regex);
                  if (match && match[1]) {
                    resolve(match[1].toLowerCase() === "true");
                  } else {
                    reject(new Error("Could not parse validation result from SOAP response"));
                  }
                } catch (error) {
                  reject(error);
                }
              } else {
                reject(new Error(`HTTP Error: ${res.statusCode}\nResponse: ${data}`));
              }
            });
          });
    
          req.on("error", (e) => {
            reject(e);
          });
    
          req.write(soapEnvelope);
          req.end();
        });
      }
}