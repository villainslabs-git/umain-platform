// Hasheo de contraseñas con Web Crypto (disponible en Workers y en Node moderno).
// Formato almacenado: pbkdf2$<iteraciones>$<salt_b64>$<hash_b64>
// verifyPassword acepta ademas el formato legado en texto plano de los seeds
// viejos, para no romper entornos de desarrollo sin migrar. En produccion la
// migracion 0008 reemplaza los seeds por hashes.

const ITERATIONS = 100_000;
const KEY_BYTES = 32;

function b64encode(buf: ArrayBuffer): string {
  let s = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function b64decode(s: string): Uint8Array {
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<ArrayBuffer> {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as unknown as BufferSource, iterations },
    material,
    KEY_BYTES * 8,
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await pbkdf2(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${b64encode(salt.buffer as ArrayBuffer)}$${b64encode(derived)}`;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (stored.startsWith("pbkdf2$")) {
    const parts = stored.split("$");
    if (parts.length !== 4) return false;
    const iterations = Number(parts[1]);
    if (!Number.isFinite(iterations) || iterations < 1) return false;
    const salt = b64decode(parts[2]);
    const expected = b64decode(parts[3]);
    const derived = new Uint8Array(await pbkdf2(password, salt, iterations));
    return timingSafeEqual(derived, expected);
  }
  // Formato legado: seeds viejos guardaban el password en texto plano.
  // Se mantiene la comparacion para entornos sin migrar, con costo constante aproximado.
  const enc = new TextEncoder();
  return timingSafeEqual(enc.encode(stored), enc.encode(password));
}
