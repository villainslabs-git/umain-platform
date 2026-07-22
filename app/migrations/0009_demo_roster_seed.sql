-- Migracion 0009: seed demo del roster Casting Club para las vistas de
-- casting y agencia. Datos inventados, coherentes con la narrativa demo
-- (Manu Jantus, splits 65/35, fees piloto USD 2.000 a 10.000).

UPDATE identities SET nombre='Manu Jantus', tier='A', contrato_ref='CONT-2026-001', updated_at=datetime('now') WHERE id='template-identity-001';

INSERT OR IGNORE INTO identities (id, nombre, tier, contrato_ref, estado, contacto_aprobacion) VALUES
 ('identity-lucia','Lucía Fernández','A','CONT-2026-002','activo','lucia@castingclub.ar'),
 ('identity-camila','Camila Torres','B','CONT-2026-003','activo','camila@castingclub.ar'),
 ('identity-sofia','Sofía López','B','CONT-2026-004','suspendido','sofia@castingclub.ar'),
 ('identity-valentina','Valentina Ruiz','C','CONT-2026-005','activo','valentina@castingclub.ar');

INSERT OR IGNORE INTO campaigns (id, nombre, cliente, descripcion, estado, created_by) VALUES
 ('campaign-loreal','Revitalift','L''Oréal Paris','Extensión de campaña filmada, versiones digitales LATAM','activa','admin-001'),
 ('campaign-pepsi','Summer Refresh','Pepsi','Versionado regional AR y BR de campaña de verano','completada','admin-001'),
 ('campaign-samsung','Galaxy Z Flip','Samsung','Stills y video 15 segundos para lanzamiento regional','activa','admin-001'),
 ('campaign-nike','Running FW26','Nike','Piezas digitales para colección running','borrador','admin-001'),
 ('campaign-cartier','Love Collection','Cartier','Campaña global de joyería, gráfica premium','activa','admin-001');

INSERT OR IGNORE INTO licenses (id, identity_id, campaign_id, alcance, economia, estado) VALUES
 ('license-manu-loreal','template-identity-001','campaign-loreal','{"territorio":"LATAM","medios":["digital","tv"],"plazo_meses":12,"categoria":"IAB-186 Belleza"}','{"monto_usd":6500,"split_talento":65,"moneda":"USD"}','vigente'),
 ('license-manu-pepsi','template-identity-001','campaign-pepsi','{"territorio":"AR+BR","medios":["digital"],"plazo_meses":6,"categoria":"IAB-1104 Bebidas"}','{"monto_usd":4200,"split_talento":65,"moneda":"USD"}','vencida'),
 ('license-manu-samsung','template-identity-001','campaign-samsung','{"territorio":"LATAM","medios":["digital","via_publica"],"plazo_meses":9,"categoria":"IAB-575 Smartphones"}','{"monto_usd":8000,"split_talento":70,"moneda":"USD"}','pendiente_aprobacion'),
 ('license-lucia-cartier','identity-lucia','campaign-cartier','{"territorio":"Global","medios":["grafica","digital"],"plazo_meses":12,"categoria":"IAB-197 Lujo"}','{"monto_usd":5450,"split_talento":70,"moneda":"USD"}','vigente'),
 ('license-lucia-nike','identity-lucia','campaign-nike','{"territorio":"LATAM","medios":["digital"],"plazo_meses":6,"categoria":"IAB-15 Deportes"}','{"monto_usd":3000,"split_talento":65,"moneda":"USD"}','pendiente_aprobacion'),
 ('license-camila-loreal','identity-camila','campaign-loreal','{"territorio":"AR","medios":["digital"],"plazo_meses":6,"categoria":"IAB-204 Cuidado capilar"}','{"monto_usd":2600,"split_talento":60,"moneda":"USD"}','pendiente_aprobacion'),
 ('license-camila-pepsi','identity-camila','campaign-pepsi','{"territorio":"AR","medios":["digital"],"plazo_meses":6,"categoria":"IAB-1104 Bebidas"}','{"monto_usd":1600,"split_talento":60,"moneda":"USD"}','vencida'),
 ('license-valentina-verano','identity-valentina','campaign-template-001','{"territorio":"AR","medios":["digital"],"plazo_meses":3,"categoria":"IAB-552 Moda"}','{"monto_usd":950,"split_talento":55,"moneda":"USD"}','vigente');

UPDATE licenses SET economia='{"monto_usd":2000,"split_talento":65,"moneda":"USD"}' WHERE id='template-license-001' AND economia IS NULL;

INSERT OR IGNORE INTO approvals (id, license_id, identity_id, tipo, metodo, token, expiracion) VALUES
 ('approval-samsung','license-manu-samsung','template-identity-001','licencia','link_firmado','tok-demo-samsung-2026','2026-07-28'),
 ('approval-nike','license-lucia-nike','identity-lucia','licencia','link_firmado','tok-demo-nike-2026','2026-08-02'),
 ('approval-loreal','license-camila-loreal','identity-camila','licencia','link_firmado','tok-demo-loreal-2026','2026-08-05');

INSERT OR IGNORE INTO exclusivity_locks (id, identity_id, license_id, categoria, territorio, marcas_bloqueadas, vencimiento) VALUES
 ('lock-manu-bebidas','template-identity-001','license-manu-pepsi','IAB-1104 Bebidas','AR+BR','["Coca-Cola","Manaos"]','2026-08-05');
