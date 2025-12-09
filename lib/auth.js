import bcrypt from "bcryptjs";

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export async function verifyPassword(plain, hash) {
  return await bcrypt.compare(plain, hash);
}