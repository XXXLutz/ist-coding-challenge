# Vat Validation API

## 1. Introduction
The Vat Validation API is a simple API that allows you to validate VAT numbers for a given country code. Or more simply, prevalidate before using the corresponding APIs to actually validate. At the moment countries from the EU are supported as well as Switzerland.

## 2. Purpose
The Vat Validation API is used to run the necessarry validations before a call to the EU or Swiss VAT APIs occurs.

## 3. Features
- The API is able to receive a given VAT number and after validations, it strips the country code because this is how the services expect to process it.
- The API is able to determine which external web service to use based on the `countryCode`:
  - If the `countryCode` is supported by the EU service, the service must make a request to the EU web service. [EU Web Service](https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number)
  - If the `countryCode` is supported by the Switzerland service, the service must make a request to the Switzerland web service. [Switzerland Web Service](https://www.uid-wse-a.admin.ch/V5.0/PublicServices.svc)
  - If the `countryCode` is not supported by either service, the service must return a `501 Not Implemented` error.

## 4. Usage
### Prerequisites
- Node.js v22.13
- pnpm v10.0.0

### Installation
1. Clone the Repo
```sh
git clone https://github.com/vlahunter/ist-coding-challenge
cd ist-coding-challenge
```

2. Install the dependencies
```sh   
pnpm install
```

3. Run the API
```sh
pnpm run start
```

4. Example Usage
After the API is up and running use any REST client of your choice to make a POST request to the `/api/vat/validate` endpoint. Use the json below as the Request Body.
```json
// for the EU Service
{
    "countryCode": "AT",
    "vat": "U18522105"
}

// or for the Swiss Service
{
    "countryCode": "CH",
    "vat": "CHE-116.267.986"
}

// expected response
// {
//     "validated": true,
//     "details": "VAT number is valid for the given country code."
// }
```

5. Run tests
```sh
pnpm run test
```

6. Important notes on usage
The API is able to receive a given VAT number and after validations, it strips the country code because this is how the services expect to process it. For example:
```json
// provided by user
{
    "countryCode": "AT",
    "vat": "ATU18522105"
}
// becomes
{
    "countryCode": "AT",
    "vat": "U18522105"
}

// more examples, User provides this
{
    "countryCode": "NL",
    "vat": "NL803441526B01"
}
// becomes like this
{
    "countryCode": "NL",
    "vat": "803441526B01"
}
```

## 5. API Docs
The API docs are available in the `docs` folder, in the `openapi.yaml` file.

## 6. Configuration 
To configure the API please edit the `config/configuration.json` file or navigate to `source/models/ConfigurationModel.ts`.

## 7. Dependencies
- Express: For handling REST requests.
- Zod: For request validation.
- Jest and Supertest: For testing.

## 8. Contributing
Please feel free to contribute to the project. Create a branch and submit a PR.

## 9. License
MIT License.
