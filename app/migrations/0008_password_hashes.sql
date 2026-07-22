-- Migracion 0008: contraseñas hasheadas (PBKDF2-SHA256, 100k iteraciones)
-- Reemplaza los seeds en texto plano. La contraseña de ambos usuarios demo
-- sigue siendo demo2026. Rotar antes de cualquier uso real.

UPDATE users SET password_hash = 'pbkdf2$100000$EDLMCcM99gTDsDKO/Pne5g==$rJ5jvagafmLkwPOHyn063rjliQoMJBC1Lg9n36x1AGA=', updated_at = datetime('now')
WHERE email IN ('admin@umain.io', 'demo@umain.io');
