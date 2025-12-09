import crypto from "crypto";

const SECRET = process.env.HMAC_SECRET;

export function generateCode(cpf, userId, issueDate) {
  const payload = `${cpf}|${userId}|${issueDate}`;
  const h = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  const short = parseInt(h.slice(0, 10), 16).toString(36).toUpperCase().slice(0, 5);
  return `BCT-${issueDate.replace(/-/g, "")}-${short}`;
}

export function recomputeShort(cpf, userId, issueDate) {
  const payload = `${cpf}|${userId}|${issueDate}`;
  const h = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return parseInt(h.slice(0, 10), 16).toString(36).toUpperCase().slice(0, 5);
}