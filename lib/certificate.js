import { generateCode, recomputeShort } from "./hmac.js";

export function validateCertificate(record) {
  const computed = recomputeShort(record.cpf, record.user_id, record.issue_date);
  const codeShort = record.code.split("-")[2];

  return computed === codeShort;
}