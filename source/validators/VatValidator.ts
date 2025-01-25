import { z } from "zod";

const regexMap: { [key: string]: RegExp } = {
  AT: /^(?:AT)?U\d{8}$/, // it seems that a valid AT number needs to start with U without AT in front.
  BE: /^(?:BE)?[01]\d{9}$/, 
  BG: /^(?:BG)?\d{9,10}$/, 
  CH: /^(?:CHE(?:-\d{3}\.\d{3}\.\d{3}|\d{9})|\d{9})$/,
  CY: /^(?:CY)?[A-Z0-9]{8}[A-Z]$/, 
  CZ: /^(?:CZ)?\d{8,10}$/, 
  DE: /^(?:DE)?\d{9}$/,
  DK: /^(?:DK)?\d{8}$/, 
  EE: /^(?:EE)?\d{9}$/, 
  EL: /^(?:EL|GR)?\d{9}$/,
  ES: /^(?:ES)?(?:\d{8}[A-Z]|[A-Z]\d{8}|[A-Z]\d{7}[A-Z])$/, 
  FI: /^(?:FI)?\d{8}$/, 
  FR: /^(?:FR)?[A-Z0-9]{2}\d{9}$/, 
  GB: /^(?:GB)?(?:\d{9}|\d{12}|GD\d{3}|HA\d{3})$/, 
  HR: /^(?:HR)?\d{11}$/, 
  HU: /^(?:HU)?\d{8}$/, 
  IE: /^(?:IE)?\d((\d|[A-Z]|\+\*)\d{5}[A-Z]|\d{6}[A-Z]{2})$/, 
  IT: /^(?:IT)?\d{11}$/, 
  LT: /^(?:LT)?\d{9,12}$/, 
  LU: /^(?:LU)?\d{8}$/, 
  LV: /^(?:LV)?\d{11}$/, 
  MT: /^(?:MT)?\d{8}$/, 
  NL: /^(?:NL)?\d{9}B\d{2}$/, 
  PL: /^(?:PL)?\d{10}$/, 
  PT: /^(?:PT)?\d{9}$/, 
  RO: /^(?:RO)?\d{2,10}$/, 
  SE: /^(?:SE)?\d{12}$/, 
  SI: /^(?:SI)?\d{8}$/, 
  SK: /^(?:SK)?\d{10}$/, 
};

const countryCodes = Object.keys(regexMap) as Array<keyof typeof regexMap>;

export const vatValidator = z.object({
  countryCode: z.enum(countryCodes as [string, ...string[]]),
  vat: z.string(),
}).refine((data) => {
  const regex = regexMap[data.countryCode];
  return regex.test(data.vat);
}, {
  message: "Invalid VAT number for the specified country",
  path: ["vat"],
});
