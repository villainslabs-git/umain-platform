# UMAIN Platform — Documentación de Vistas

**Versión:** v0.3.0 | **Stack:** React 19 + TanStack Start + Cloudflare D1 | **Motor de generación:** Higgsfield API

---

## 1. Landing Page (`/landing`)

**Propósito:** Página pública de presentación del producto. Es la puerta de entrada para marcas, castineras y talentos.

### Elementos principales:
- **Header/Nav:** Logo UMAIN con links a "Cómo funciona", "Para marcas", "Para talento" y "Portal de talento"
- **Hero:** Tagline _«Identidad real, licenciada con intención.»_ con descripción del valor de UMAIN como infraestructura de gemelos digitales del talento hispano. Botón CTA: "Ver la demo del portal →"
- **Métricas clave:** 0 usos sin consentimiento, 50-70% del fee para el talento, taxonomía IAB 3.1, credenciales C2PA
- **Cómo funciona (3 pilares):**
  1. **Capture Protocol:** Sesión de 45 min con video 4K multi-ángulo, 40-80 fotos guiadas, captura de voz 10-15 min, cifrado AES-256
  2. **Rights Engine:** Base de datos de identidades, compuerta de consentimiento, workflow de aprobación del talento, AuditLog inmutable con SHA-256 + firma ed25519
  3. **Generation Layer:** Triple Pipeline sobre Higgsfield — Pipeline A (Soul ID 2.0) + Pipeline B (GPT Image 2 / Nano Banana Pro) + Pipeline C (Seedream V5 Pro adaptativo)
- **Para marcas:** Beneficios (campañas sin re-shooting, consentimiento granular, trazabilidad C2PA, exclusividad competitiva, compliance Ley 25.326) y proceso de 5 pasos
- **Para castineras:** Explicación del modelo de negocio (ingresos pasivos), split 50-70% talento / 20-30% castinera / 10-20% UMAIN, contrato tripartito, exclusividad solo digital, 3 años renovables

---

## 2. Login (`/login`)

**Propósito:** Autenticación de talentos y representantes.

### Elementos principales:
- **Layout dividido:** Panel izquierdo con branding UMAIN y tagline, panel derecho con formulario de login
- **Tagline:** _"Cada uso de tu identidad digital, con tu consentimiento explícito."_
- **Features destacadas:** Rights Engine · Trazabilidad C2PA · Split 65/35
- **Formulario:** Campos de Email y Contraseña, botón "Ingresar"
- **Credenciales demo:** `admin@umain.io` / `demo2026`
- **Link:** "← Volver al inicio"

---

## 3. Dashboard (`/dashboard`)

**Propósito:** Panel principal post-login con resumen de actividad, métricas y accesos rápidos.

### Elementos principales:
- **Sidebar izquierdo** con navegación completa (ver sección 4)
- **Header:** "Hola equipo, acá está el resumen."
- **Métricas (KPIs):**
  - Identidades activas: 0
  - Licencias vigentes: 0
  - Campañas activas: 0
  - Aprobaciones pendientes: 0
- **Actividad Reciente (línea de tiempo):**
  - Nuevo proyecto esperando aprobación (IAB-575 Smartphones, LATAM, deadline 28 abr)
  - L'Oréal Paris campaña 'Revitalift' entregada
  - Exclusividad Pepsi liberándose en 14 días
  - Reporte de regalías Q4 2025: $10,712 ganado, 7 usos activos
- **Usos Recientes (tabla):**
  - L'Oréal Paris Revitalift — IAB-186, Video corto, AR+CL+UY, Activo
  - Pepsi Summer refresh — IAB-1104, Fotos, AR+BR, Bloqueado
  - Zara Holiday collection — IAB-225, Editorial, Global, Vencido
- **Consentimiento Rápido:** Matriz al 72% (47 de 65 categorías evaluadas), top 6 categorías activas, link a editar matriz
- **Exclusividades Activas:** L'Oréal Paris (hasta 15 jun 2026, 54 días restantes), Pepsi (hasta ago 2026)

---

## 4. Sidebar de Navegación (común a todas las rutas autenticadas)

Estructura jerárquica del menú lateral:

| Sección | Items |
|---|---|
| **General** | Panel, Mi perfil |
| **Mi Identidad** | Avatares/Clones, Consentimiento |
| **Campañas** | Campañas, Licencias, Jobs |
| **Derechos** | Registro de usos, Exclusividades, Contratos |
| **Sistema** | Audit Log, Proveedores, Legal, Docs |

Footer: "UMAIN v0.3.0 — Rights Engine + Higgsfield"

---

## 5. Perfil (`/profile`)

**Propósito:** Ficha personal del talento con datos personales, representación, modelo digital y compensación.

### Secciones:
- **Información Personal:** Nombre (Manuela Jantus), nombre profesional (Manu Jantus), fecha de nacimiento (22 feb 1986), nacionalidad (Argentina), domicilio (Buenos Aires), idiomas (Español nativo, Inglés fluido, Portugués intermedio)
- **Contacto:** Email, teléfono (cifrado), contacto de emergencia (Casting Club)
- **Representación:** Agencia (Casting Club, Buenos Aires), representante (Federico López), tipo de contrato (Tripartito), exclusividad (solo digital)
- **Modelo Digital:** Tipo (Flux LoRA + MetaHuman), dataset (48 fotos, 2.4 GB), último entrenamiento (Mar 2026), versión (v2.1), almacenamiento (AWS S3 cifrado). Botones: "Solicitar reentrenamiento", "Solicitar supresión (Ley 25.326)"
- **Tier y Compensación:** Tier A, split 65/35, mínimo garantizado $18,000/año, reportes trimestrales

---

## 6. Casting — Dashboard de Representante (`/casting/dashboard`)

**Propósito:** Panel para castineras/representantes que gestionan un roster de talentos.

### Elementos:
- **Header:** "Panel de representante — Gestiona tu roster de talentos, aprueba solicitudes en su nombre y supervisa las campañas activas."
- **Métricas:** 4 talentos activos, 10 proyectos activos, $26,112 en regalías ($5,222 comisión), 3 aprobaciones pendientes
- **Roster (cards por talento):**
  - Manu Jantus — Tier A, 4 proyectos, $10,712, activo
  - Lucía Fernández — Tier A, 3 proyectos, $8,450, activo
  - Camila Torres — Tier B, 2 proyectos, $4,200, activo
  - Sofía López — Tier B, 0 proyectos, $1,800, suspendido
  - Valentina Ruiz — Tier C, 1 proyecto, $950, activo
- **Aprobaciones Pendientes (3):** Samsung Galaxy Z Flip (deadline 28 abr), Nike Running (deadline 2 may), L'Oréal Paris (deadline 5 may)
- **Acciones rápidas:** Nuevo talento, Gestionar contratos, Reportes de comisiones

---

## 7. Casting — Nuevo Talento (`/casting/new-talent`)

**Propósito:** Formulario wizard de 4 pasos para dar de alta un nuevo talento en el roster.

### Pasos del wizard:
1. **Datos personales:** Nombre completo, nombre profesional, fecha de nacimiento, nacionalidad (AR/CL/UY/BR/CO/MX/ES), tier (A/B/C), email, teléfono, notas internas
2. **Representación:** Split (50-80%), tipo de contrato (tripartito), configuración de exclusividad
3. **Configuración del avatar:** Consentimiento por defecto (caso por caso), exclusividad por categoría IAB, territorios (global), modelo digital (Flux LoRA + MetaHuman)
4. **Fotos para Soul ID:** Upload area (drag & drop), requisitos (mín 20 fotos, variedad de ángulos, expresiones, iluminación, resolución 1024x1024, sin accesorios que tapen el rostro). Entrenamiento: ~5 minutos.

---

## 8. Identidades / Avatares (`/identities`)

**Propósito:** Gestión de avatares digitales y clones de voz.

### Elementos:
- **Header:** "Gestión de avatares digitales y clones de voz"
- **Botón:** "+ Nuevo Avatar/Clon"
- **Tabla vacía** con columnas: Nombre, Tier, Estado, Agencia, Contrato, Creado
- **Empty state:** "No hay Avatares/Clones registrados — Hacé clic en '+ Nuevo Avatar/Clon' para comenzar"

---

## 9. Catálogo de Agencias (`/agency/catalog`)

**Propósito:** Portal para agencias (ej. BBDO Buenos Aires) que buscan talento para campañas.

### Elementos:
- **Sub-nav:** Catálogo, Solicitudes, Campañas, Contratos
- **Header:** "Encontrá el talento ideal — Buscá entre talentos verificados con consentimiento granular."
- **Filtros:** Todos, Disponibles, Tier A
- **Resultados (5 talentos):**
  - Manu Jantus (BA, Tier A, Moda/Belleza/Lifestyle, $2,500/campaña, Disponible)
  - Lucía Fernández (Santiago, Tier A, Deportes/Fitness/Tech, $2,200/campaña, Disponible)
  - Camila Torres (CDMX, Tier B, Cosmética/Lujo/Travel, $1,800/campaña, Ocupado hasta Jun)
  - Sofía López (Bogotá, Tier B, Food/Lifestyle/Home, $1,500/campaña, Disponible)
  - Valentina Ruiz (Montevideo, Tier C, Moda/Street/Music, $900/campaña, Disponible)
- **CTA por talento:** "Solicitar"

---

## 10. Contratos (`/contracts`)

**Propósito:** Biblioteca legal con todos los documentos firmados.

### Secciones:
- **Acuerdos Marco:** Acuerdo Marco de Talento (tripartito, ley argentina, 3 años, firmado 14 may 2025), Anexo I — Matriz de consentimiento v2 (47 categorías, firma digital), Anexo II — Tabla de ventanas de exclusividad
- **Consentimientos por Proyecto:** L'Oréal Paris Revitalift (#UM-2026-0412), Pepsi Summer refresh (#UM-2026-0198), Cartier Love collection (#UM-2026-0021)
- **Legal y Compliance:** Consentimiento datos biométricos Ley 25.326, NDA pre-captura

---

## 11. Regalías (`/royalties`)

**Propósito:** Reportes de ingresos, splits y evolución financiera.

### Elementos:
- **KPIs financieros:**
  - Ganado Q1 2026: $8,996 (5 usos activos)
  - Ganado Q4 2025: $10,712 (pagado 15 ene 2026)
  - Progreso mínimo garantizado: 50% ($8,996 de $18,000)
  - Próximo pago: 15 jul (Reporte Q2 2026)
- **Gráfico de evolución:** 4 trimestres ($3.3k → $9.1k → $10.7k → $9.0k)
- **Desglose Q1 2026:**
  - L'Oréal Paris Revitalift: $2,100 bruto → $1,365 (tu parte)
  - H&M Spring/Summer: $1,800 → $1,170
  - Pepsi Summer refresh: $3,200 → $2,080
  - Cartier Love collection: $5,500 → $3,575
  - MAC Ruby Woo residual: $1,240 → $806
  - **Total Q1 2026: $13,840 bruto → $8,996 neto**
- **Historial:** Q4, Q3 y Q2 2025 con descarga de PDF

---

## 12. Exclusividades (`/locks`)

**Propósito:** Gestión de ventanas competitivas que protegen a las marcas.

### Elementos:
- **Resumen:** 2 exclusividades activas en 2 categorías, 11 marcas bloqueadas, $8,060 protegidos
- **Exclusividad L'Oréal Paris:** IAB-186 Cuidado capilar, bloquea Pantene/Herbal Essences/Dove Hair/TRESemmé/Schwarzkopf, vence 15 jun 2026 (65% transcurrido)
- **Exclusividad Pepsi:** IAB-1104 Bebidas, bloquea Coca-Cola/Fanta/Sprite/Dr Pepper/7Up/Mirinda, vence 30 ago 2026 (32% transcurrido)
- **Liberadas recientemente:** MAC Cosmetics (mar 2026), Adidas (ene 2026)

---

## 13. Registro de Usos (`/usage`)

**Propósito:** Historial completo de usos licenciados de la identidad digital con trazabilidad C2PA.

### Elementos:
- **KPIs:** 23 usos totales desde nov 2025, 7 activos ahora, $32,080 ingresos acumulados, $1,395 promedio por proyecto
- **Tabla de usos (7 entradas demo):**
  - Abr 2026: L'Oréal Paris Revitalift — $2,100 (AR+CL+UY, Activo)
  - Feb 2026: H&M Spring/Summer — $1,800 (Global, Activo)
  - Feb 2026: Pepsi Summer refresh — $3,200 (AR+BR, Bloqueado)
  - Ene 2026: Cartier Love — $5,500 (EU+US, Activo)
  - Dic 2025: Zara Holiday — $2,400 (Global, Vencido)
  - Nov 2025: Quilmes Summer — $1,100 (AR, Vencido)
  - Oct 2025: MAC Ruby Woo — $2,800 (Global, Vencido)

---

## 14. Configuración / Proveedores (`/settings` y `/settings/providers`)

**Propósito:** Gestión de APIs de generación (Higgsfield y otros).

### `/settings`:
- Explicación del uso de Higgsfield como motor de generación (imágenes, video, voz)
- Estado: "No hay proveedores configurados"
- CTA: "Agregar API" y configurar Higgsfield API key

### `/settings/providers`:
- Vista de proveedores activos (0 configurados), modelos disponibles (0), llamadas totales (0)
- Botón "Test Todos" y "+ Agregar Proveedor"
- Soporte para proveedores cloud y locales (ComfyUI, Ollama)

---

## 15. Audit Log (`/audit-log`)

**Propósito:** Registro inmutable de operaciones del Rights Engine con encadenamiento criptográfico.

### Elementos:
- **Badges:** SHA-256 chained, 25519 signed, Append-only (sin UPDATE/DELETE), Hash chain verificada, Firma por lote con KMS
- **Botón:** "Verificar cadena"
- **Empty state:** Tabla con columnas Seq, Evento, Payload, Identity, Timestamp, Hash — vacía inicialmente

---

## 16. Licencias (`/licenses`)

**Propósito:** Gestión de tokens de licencia y consentimiento.

### Elementos:
- **Header:** "Gestión de tokens de licencia y consentimiento"
- **Empty state:** "Las licencias se generan al crear una campaña con un talento asignado"
- Tabla: Talento, Campaña, Estado, Alcance, Creada, Token

---

## 17. Biblioteca Legal (`/legal`)

**Propósito:** Repositorio de contratos, certificados de supresión y documentos de consentimiento.

### Elementos:
- **Header:** "Contratos, certificados de supresión y documentos de consentimiento"
- **Empty state:** "Los contratos y certificados aparecerán aquí automáticamente"
- Tabla: Título, Tipo, Talento, Hash, Subido

---

## 18. Documentación Técnica (`/docs`)

**Propósito:** Documentación técnica onboard para desarrolladores.

### Secciones:
- **Stack Tecnológico:** React 19, TanStack Start SSR, TypeScript 5.8+, Tailwind v4, Cloudflare D1, R2, Vite 7 + bun
- **Estructura:** `app/src/` con componentes, lib (queries, types, bindings), 14+ rutas file-based
- **Design System:** Variables CSS custom con prefijo `--color-umain-*`
- **Base de Datos:** 7 migraciones DDL con esquema de identities, consentimiento, contratos, avatar engine
- **Triple Pipeline documentado:** Pipeline A (Soul ID 2.0), Pipeline B (GPT Image 2 + Nano Banana Pro), Pipeline C (Seedream V5 Pro con corrección facial)
- **Matriz de modelos Higgsfield:** Modelos, resoluciones, costos estimados
- **Guía de despliegue** y **credenciales demo**

---

## 19. Jobs de Generación (`/jobs`)

**Propósito:** Interfaz para solicitar generación de contenido (imagen, video, voz) a través de la capa de abstracción UMAIN → Higgsfield.

### Elementos:
- **Configuración de capa:** API endpoint `https://api.higgsfield.ai/v1`, modelos (nano_banana_2, seedream_v4_5, seedance_2_0, veo3, kling2_6, seed_audio, elevenlabs)
- **Compuerta de consentimiento (5 pasos):** Validar token JWT → Validar alcance → Validar matriz → Validar exclusividad → Generar
- **Empty state:** "No hay jobs de generación"
- **Acciones:** Generar Imagen (Avatar/Still), Generar Video (próximamente), Clonar Voz (próximamente)

---

## 20. Campañas (`/campaigns`)

**Propósito:** Gestión de campañas publicitarias.

### Elementos:
- **Header:** "Gestión de campañas publicitarias"
- **Empty state:** "No hay campañas — Creá la primera campaña para empezar"
- Tabla: Nombre, Cliente, Estado, Creada

---

## 21. Compuerta de Consentimiento (`/consent-gate`)

**Propósito:** Interfaz de validación del Rights Engine — 5 pasos en cadena antes de autorizar cualquier generación.

### Elementos:
- **Header:** "Rights Engine v2 — 5 validaciones en cadena"
- **Pipeline visual:** Token JWT → Alcance → Matriz → Exclusividad → AuditLog
- **Formulario de solicitud:**
  - License ID / Identity ID
  - Tipo: Imagen / Video / Voz
  - Medio: Redes Sociales / TV / Digital / Vía Pública
  - Territorio: Argentina / Estados Unidos / Latinoamérica / Mundo
  - Categoría IAB: 8 opciones (iab-1 a iab-46, con iab-15 PROHIBIDO)
  - Marca, Prompt
- **Botones:** "Ejecutar compuerta (solo validar)" y "Validar + generar job"
- **Datos demo precargados:** template-license-001, template-identity-001

---

## 22. Aprobación por Token (`/approval/$token`)

**Propósito:** Página de aprobación que recibe el talento vía magic link para aprobar o rechazar un uso específico de su identidad.

### Funcionalidad:
- Recibe un token único por URL
- Muestra los detalles de la solicitud (marca, campaña, territorio, categoría IAB)
- Botones Aprobar / Rechazar
- Registra la decisión en el AuditLog

---

## Resumen de Arquitectura

```
┌─────────────────────────────────────────────────┐
│                   UMAIN Platform                 │
│            React 19 + TanStack Start             │
│              Cloudflare Pages SSR                │
├─────────────────────────────────────────────────┤
│  Landing  │  Login  │  Dashboard  │  Sidebar    │
├─────────────────────────────────────────────────┤
│  Profile  │  Casting  │  Identities  │  Agency  │
├─────────────────────────────────────────────────┤
│  Contracts │  Royalties │  Locks │  Usage       │
├─────────────────────────────────────────────────┤
│  Audit Log │  Providers │  Legal │  Docs        │
├─────────────────────────────────────────────────┤
│  Licenses  │  Campaigns  │  Jobs  │  Consent    │
├─────────────────────────────────────────────────┤
│              Rights Engine v2                    │
│     JWT → Scope → Matrix → Exclusivity → Log    │
├─────────────────────────────────────────────────┤
│           Triple Pipeline (Higgsfield)           │
│   Soul ID 2.0 │ GPT Image 2 │ Seedream V5 Pro   │
├─────────────────────────────────────────────────┤
│         Cloudflare D1 (SQLite) + R2             │
└─────────────────────────────────────────────────┘
```

---

*Documento generado a partir del preview en `localhost:5180` — 22 de julio de 2026.*