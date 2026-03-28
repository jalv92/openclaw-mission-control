# OpenClaw Mission Control — UX/UI Audit Report

**Date:** 2026-03-28  
**Auditor:** Senior UX/UI Expert + Automated Analysis  
**Scope:** 8 pages audited (Overview, Tasks, Agents, Activity, Memory, Workspace, Logs, Settings)  
**Target:** http://localhost:3000  

---

## 1. Evaluación de Heurísticas de Usabilidad (Nielsen)

### H1 — Visibilidad del estado del sistema

| Página | Estado | Detalle |
|--------|--------|---------|
| Overview | ⚠️ Parcial | Muestra "Connecting..." cuando WS no está conectado, pero no hay indicador de error visible cuando la API falla |
| Tasks | ✅ Correcto | Kanban muestra estado (pending, failed, etc.) claramente |
| Settings | ⚠️ Parcial | "Test Connection" muestra feedback de éxito/fracaso, pero el campo de token expone el valor en texto plano |
| Logs | ✅ Correcto | Flujo de logs en tiempo real visible |

**Problema crítico:** `catch(e) {}` vacío en todas las páginas — errores de API son completamente silenciosos para el usuario.

---

### H2 — Adecuación entre el sistema y el mundo real

| Página | Estado | Detalle |
|--------|--------|---------|
| Tasks | ✅ Correcto | Columnas "pending", "in_progress", "completed" son intuitivas |
| StatusBadge | ⚠️ Warning | Emoji ⚡ para "on-demand" puede no ser universalmente comprendido; rojo para "failed" es claro |
| Logs | ⚠️ Warning | Texto de logs en español mezclado con inglés, formatos mixtos de timestamp |

---

### H3 — Control y libertad del usuario

| Página | Estado | Detalle |
|--------|--------|---------|
| Sidebar | ❌ Falta | No hay botón "ir atrás", no hay breadcrumb, el usuario puede perderse en la navegación |
| Tasks | ⚠️ Parcial | No hay forma de cancelar una tarea en cola |
| Settings | ⚠️ Parcial | "Logout" hace `window.location.reload()` — no hay confirmación |

---

### H4 — Consistencia y estándares

| Página | Estado | Detalle |
|--------|--------|---------|
| Global | ❌ Problema | Uso extensivo de **inline styles** (`style={{...}}`) en lugar de clases CSS — inconsistencia masiva |
| glass-panel | ✅ Correcto | Clase reutilizable con valores consistentes |
| Sidebar | ❌ Problema | 260px hardcoded — no hay variable CSS para el ancho del sidebar |
| Colores | ✅ Correcto | Variables CSS (`--accent-*`) usadas consistentemente |

---

### H5 — Prevención de errores

| Página | Estado | Detalle |
|--------|--------|---------|
| Tasks | ⚠️ Parcial | Input de nueva tarea permite strings vacíos (`trim()` existe pero no hay validación visual) |
| Settings | ❌ Crítico | **Token expuesto en el código fuente del AuthProvider** (`CORRECT_TOKEN = 'openclaw-mc-token'`) |
| Forms | ❌ Problema | No hay validación en tiempo real, no hay mensajes de error inline |
| Password | ❌ Problema | El campo de token en Settings es tipo `password` pero muestra el valor al hacer click |

---

### H6 — Reconocimiento antes que recuerdo

| Página | Estado | Detalle |
|--------|--------|---------|
| Overview | ✅ Correcto | Labels descriptivas: "Tasks Pending", "Active Agents" |
| Navigation | ⚠️ Warning | Iconos sin texto alternativo visible — dependen de memoria del ícono |
| StatusBadge | ⚠️ Parcial | Estados en mayúsculas (`ACTIVE`, `FAILED`) ayudan al reconocimiento |

---

### H7 — Flexibilidad y eficiencia de uso

| Página | Estado | Detalle |
|--------|--------|---------|
| Tasks | ⚠️ Warning | Kanban no permite drag-and-drop — solo visualización |
| Logs | ❌ Problema | No hay filtros por nivel de log, no hay búsqueda avanzada |
| Workspace/Memory | ⚠️ Warning | Solo carga bajo demanda — no hay paginación |

---

### H8 — Diseño estético y minimalista

| Página | Estado | Detalle |
|--------|--------|---------|
| Global | ✅ Correcto | Tema oscuro consistente, jerarquía clara con typografía |
| glass-panel | ✅ Correcto | Efecto glassmorphism elegante |
| Logs | ❌ Problema | **Scroll horizontal forzado** en líneas de comando largas — rompe el layout |
| Task Board | ⚠️ Parcial | Las columnas son angostas (320px fixed) — mucho espacio vacío en pantallas grandes |

---

### H9 — Recuperación de errores

| Página | Estado | Detalle |
|--------|--------|---------|
| Settings | ❌ Crítico | `handleTest()` restaura el localStorage original sin restaurar las credenciales si el test falla |
| Global | ❌ Crítico | `catch(e) {}` vacío — sin recuperación, sin feedback |
| WebSocket | ⚠️ Warning | Reconnect automático pero sin indicador visible de reintento |

---

### H10 — Ayuda y documentación

| Página | Estado | Detalle |
|--------|--------|---------|
| Settings | ✅ Correcto | Secciones de ayuda para Cloudflare Tunnel |
| Global | ❌ Falta | No hay tooltip, no hay documentación inline, no hay ayuda contextual |

---

## 2. Accesibilidad (WCAG 2.1 AA)

### 2.1 Contraste de color

| Elemento | Ratio | WCAG AA | Problema |
|----------|-------|---------|----------|
| `--text-secondary` (#8E8E93) sobre `#000000` | ~7.5:1 | ✅ Pasa | — |
| `--text-tertiary` (#636366) sobre `#000000` | ~3.9:1 | ❌ Falla | No alcanza 4.5:1 mínimo |
| Texto en glass-panel sobre backdrop | Variable | ⚠️ Depende | `backdrop-filter` puede reducir contraste en fondos complejos |
| Botón "Logout" (red) sobre fondo | ~4.2:1 | ⚠️ Warning | Podría no pasar en combinaciones específicas |

### 2.2 Legibilidad tipográfica

| Elemento | Tamaño | Estado | Detalle |
|----------|--------|--------|---------|
| Body text | 16px base | ✅ Correcto | Inter 400, line-height 1.5 |
| Labels | 0.85rem (~13.6px) | ⚠️ Warning | Por debajo de 14px recommended para labels |
| Headings | 2rem (~32px) | ✅ Correcto | Jerarquía clara |
| Code/logs | 0.8rem JetBrains Mono | ✅ Correcto | Monospace legible para código |

### 2.3 Navegación por teclado

| Test | Resultado | Detalle |
|------|-----------|---------|
| Tab focus | ❌ No visible | **No hay `:focus-visible`** definido en CSS — no hay indicador de foco |
| Skip link | ❌ Falta | No hay "Skip to main content" |
| Sidebar nav | ⚠️ Funciona | Links son tabulables pero sin feedback visual |

### 2.4 Semántica ARIA

| Elemento | Estado | Problema |
|----------|--------|----------|
| `<main>` | ✅ Presente | Generado por Next.js |
| Sidebar `<nav>` | ✅ Presente | Tiene role="navigation" implícito |
| StatusBadge | ⚠️ Warning | No tiene `role="status"` — un lector de pantalla no sabe que es un indicador de estado live |
| Form inputs | ⚠️ Parcial | Falta `aria-describedby` para los textos de ayuda |

### 2.5 Movimiento y animación

| Elemento | Estado | Detalle |
|----------|--------|---------|
| `@keyframes fadeIn` | ⚠️ Warning | No hay `@media (prefers-reduced-motion)` — puede afectar a usuarios vestibulares |
| WebSocket pulse | ✅ Correcto | Glow animation en indicador de conexión |

---

## 3. Análisis Visual y de Interfaz

### 3.1 Jerarquía Visual

- **Overview:** ✅ Buena — MetricCards grandes (2.5rem) + AgentFleet con iconografía clara
- **Tasks:** ⚠️ Mejorable — Columnas iguales, el failed task destaca naturalmente
- **Settings:** ✅ Correcto — Secciones agrupadas lógicamente

### 3.2 Espaciado

| Página | Espaciado | Evaluación |
|--------|-----------|------------|
| Overview | 2rem gap, 1.5rem padding | ✅ Consistente |
| Tasks | 1rem gap entre cards | ⚠️ Podría ser más denso |
| Settings | 1.5rem gap entre secciones | ✅ Correcto |

### 3.3 Sistema de Diseño

| Componente | Consistencia | Notas |
|------------|--------------|-------|
| Botones | ⚠️ Inconsistente | Algunos usan inline `background`, otros usan CSS vars |
| Iconos | ✅ Correcto | Lucide-react consistente en todo el sitio |
| Badges | ✅ Correcto | StatusBadge reutilizable y consistente |
| Panels | ✅ Correcto | glass-panel CSS class bien implementada |

### 3.4 Carga Cognitiva

| Problema | Impacto | Detalle |
|----------|---------|---------|
| Sidebar 260px fija | Medio | Ocupa mucho espacio en laptops pequeños |
| Logs sin wrap | Alto | Scroll horizontal forzado — muy difícil de leer |
| Metrics 4 columnas | Medio | En pantallas < 1024px puede romper layout |

---

## 4. Flujos y Comportamiento

### 4.1 Estados de error silenciosos

**CRÍTICO — Encontrado en múltiples archivos:**

```tsx
// page.tsx:22
} catch(e) {}  // SILENCIOSO

// tasks/page.tsx:16
} catch(e) {}  // SILENCIOSO

// agents/page.tsx:24
} catch(e) {}  // SILENCIOSO
```

El usuario **nunca sabe** cuando una llamada a la API falla.

### 4.2 Estados de WebSocket

| Estado | UX | Problema |
|--------|-----|----------|
| Conectando | ✅ Muestra "Connecting..." | — |
| Conectado | ✅ Muestra "Realtime Connected" | — |
| Error de conexión | ❌ No hay feedback | El usuario ve datos congelados sin saber por qué |

### 4.3 Formularios

| Form | Validación | Feedback |
|------|------------|----------|
| Nueva Tarea | Solo `trim()` | No hay mensaje de "tarea vacía" |
| Settings API URL | Ninguna | Acepta cualquier URL |
| Settings Token | Ninguna | No hay validación de formato |

### 4.4 Responsividad

| Breakpoint | Estado | Problema |
|------------|--------|----------|
| 375px (mobile) | ❌ Roto | Sidebar 260px no colapsa — layout roto |
| 768px (tablet) | ⚠️ Mejorable | Funcional pero sidebar ocupa 33%+ del viewport |
| 1024px+ | ✅ Correcto | Layout correcto |

---

## 5. Tabla de Errores

| ID | Severidad | Categoría | Heurística/WCAG | Página | Elemento | Problema | Solución Sugerida |
|----|-----------|-----------|------------------|--------|----------|----------|-------------------|
| E01 | 🔴 CRÍTICO | UX | H5, H9 | Múltiples | catch(e){} | Errores API silenciosos — usuario no sabe cuando algo falla | Reemplazar todos los catch vacíos con toast/notification de error |
| E02 | 🔴 CRÍTICO | Security/UX | H5 | Settings | Token field | Token expuesto en código fuente (AuthProvider) + campo tipo password muestra valor | Mover token al backend, usar input tipo password real con toggle |
| E03 | 🔴 CRÍTICO | Accesibilidad | WCAG 2.1 AA | Global | :focus | **No existe `:focus-visible`** en CSS — navegación por teclado imposible | Agregar `:focus-visible { outline: 2px solid var(--accent-blue); }` |
| E04 | 🔴 CRÍTICO | Responsive | H8 | Global | Sidebar | Sidebar 260px fija no colapsa en mobile — layout roto en <768px | Media query para colapsar sidebar en móvil con hamburger menu |
| E05 | 🟠 ALTO | UX | H8 | Logs | Log lines | Scroll horizontal forzado en líneas de comando largas | `word-wrap: break-word; overflow-x: auto;` con wrap opcional |
| E06 | 🟠 ALTO | Accesibilidad | WCAG 1.4.3 | Global | --text-tertiary | Contraste 3.9:1 falla WCAG AA (mínimo 4.5:1) | Aumentar a #48484A (~5:1) o usar `--text-secondary` |
| E07 | 🟠 ALTO | UX | H3 | Sidebar | Navigation | No hay botón "volver" ni breadcrumbs — desorientación | Agregar breadcrumb dinámico o botón de retorno |
| E08 | 🟠 ALTO | UX | H9 | Settings | handleTest() | Test de conexión restaura credenciales originales si falla — confusión | No restaurar automáticamente, mostrar estado diferenciado |
| E09 | 🟡 MEDIO | UX | H7 | Logs | Filtering | No hay filtros por nivel (INFO, WARN, ERROR) ni búsqueda | Agregar dropdown de filtro + search bar |
| E10 | 🟡 MEDIO | UX | H7 | Tasks | Kanban | No hay drag-and-drop para reordenar tareas | Implementar drag-drop con biblioteca (dnd-kit o similar) |
| E11 | 🟡 MEDIO | Accesibilidad | WCAG 2.4.1 | Global | <nav> | No hay "Skip to content" link | Agregar link oculto que salte al <main> |
| E12 | 🟡 MEDIO | Accesibilidad | WCAG 4.1.2 | StatusBadge | Badge | Falta `role="status"` para lectores de pantalla | Agregar `role="status"` y `aria-live="polite"` |
| E13 | 🟡 MEDIO | UX | H10 | Global | Help | No hay tooltips, no hay documentación inline | Implementar sistema de ayuda contextual |
| E14 | 🟡 MEDIO | Motion | WCAG 2.3.3 | globals.css | Animations | No hay `@media (prefers-reduced-motion)` | Envolver animaciones en `@media (prefers-reduced-motion: no-preference)` |
| E15 | 🟢 BAJO | UX | H6 | Sidebar | Nav icons | Iconos sin `aria-label` — semánticamente incompletos | Agregar `aria-label` a cada link de navegación |
| E16 | 🟢 BAJO | UX | H4 | Global | Inline styles | Uso extensivo de `style={{...}}` — difícil de mantener consistencia | Migrar a CSS modules o variables de tema |
| E17 | 🟢 BAJO | Accesibilidad | WCAG 1.3.1 | Forms | Input fields | Falta `aria-describedby` vinculando inputs con textos de ayuda | Asociar cada input con su `id` de help text |
| E18 | 🟢 BAJO | UX | H3 | Settings | Logout | `window.location.reload()` sin confirmación — pérdida accidental de sesión | Cambiar a confirmación o useRouter.push suave |

---

## 6. Roadmap de Implementación

### 🔥 FASE 0 — Críticos Inmediatos (1-2 días)

| Prioridad | ID | Acción | Archivos |
|-----------|----|--------|----------|
| P0 | E03 | Agregar `:focus-visible` CSS | `globals.css` |
| P0 | E04 | Implementar sidebar responsive (hamburger menu) | `Sidebar.tsx`, `globals.css` |
| P0 | E01 | Reemplazar todos los `catch(e){}` con manejo de errores visible | `useApi.ts`, `useWebSocket.ts`, pages |
| P0 | E02 | Eliminar token hardcodeado del cliente | `AuthProvider.tsx` |

### ⚡ FASE 1 — Alta Prioridad (3-5 días)

| Prioridad | ID | Acción | Archivos |
|-----------|----|--------|----------|
| P1 | E06 | Corregir contraste `--text-tertiary` | `globals.css` |
| P1 | E05 | Fix scroll horizontal en logs | `globals.css` |
| P1 | E07 | Agregar breadcrumb o botón de retorno | `layout.tsx` o nuevo componente |
| P1 | E08 | Corregir lógica de Test Connection | `settings/page.tsx` |

### 📋 FASE 2 — Mejoras Medias (1-2 semanas)

| Prioridad | ID | Acción | Archivos |
|-----------|----|--------|----------|
| P2 | E09 | Agregar filtros y búsqueda en Logs | `logs/page.tsx` |
| P2 | E10 | Implementar drag-drop en Kanban | `tasks/page.tsx` |
| P2 | E11 | Agregar skip-to-content link | `layout.tsx` |
| P2 | E12 | Agregar role="status" a StatusBadge | `StatusBadge.tsx` |
| P2 | E14 | Agregar soporte prefers-reduced-motion | `globals.css` |

### 🎨 FASE 3 — Estética y Polish (2-3 semanas)

| Prioridad | ID | Acción | Archivos |
|-----------|----|--------|----------|
| P3 | E16 | Migrar inline styles a CSS modules | Todos los pages |
| P3 | E13 | Implementar sistema de ayuda/tooltips | Componente Tooltip |
| P3 | E15 | Agregar aria-labels a navegación | `Sidebar.tsx` |
| P3 | E17 | Asociar inputs con help text via aria-describedby | `settings/page.tsx` |
| P3 | E18 | Agregar confirmación antes de Logout | `settings/page.tsx` |

---

## 7. Verificación y Validación

### Checklist de pruebas post-implementación:

- [ ] Navegación por teclado: Tab/Shift+Tab muestra indicadores de foco visibles
- [ ] Mobile (375px): Sidebar colapsa, contenido legible sin scroll horizontal
- [ ] Simular error de API: Toast/notification visible para el usuario
- [ ] Contraste: Verificar `--text-tertiary` pasa 4.5:1 con DevTools
- [ ] prefers-reduced-motion: Animaciones se deshabilitan
- [ ] Screen reader: StatusBadge anuncia cambios de estado

### Screenshots capturados:

| Archivo | Descripción |
|---------|-------------|
| `01-overview.png` | Dashboard principal |
| `02-tasks.png` | Task Board Kanban |
| `03-agents.png` | Fleet de agentes |
| `04-activity.png` | Feed de actividad |
| `05-memory.png` | Explorador de memoria |
| `06-workspace.png` | Explorador de workspace |
| `07-logs.png` | Visor de logs |
| `08-settings.png` | Configuración (desktop) |
| `09-settings-mobile.png` | Settings en móvil (375px) |

---

*Informe generado automáticamente mediante auditoría UX/UI sistemática.*
