import { hash, verify } from "@node-rs/argon2";

const passwordPolicy = {
  algorithm: 2,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
} as const;

export function validatePasswordLength(password: string) {
  return password.length >= 12 && password.length <= 128;
}

export async function hashPassword(password: string) {
  return hash(password, passwordPolicy);
}

export async function verifyPassword(passwordHash: string, password: string) {
  return verify(passwordHash, password);
}
