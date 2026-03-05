# EAFC Ratings

Prueba técnica frontend — React + TypeScript + Material UI.

Aplicación web que consume el API de EA Sports FC para mostrar el listado de jugadores con sus valoraciones, soporte de infinite scroll, caché y vista de detalle.

---

## Inicio rápido

```bash
npm install
npm run dev
npm run test
npm run build
```

---

## Arquitectura

### Estructura de carpetas

```
src/
├── api/                        # Capa de acceso a datos (desacoplada)
│   └── players.api.ts
├── common/
│   ├── constants/              # Constantes globales (URL, page size…)
│   ├── hooks/                  # Custom hooks reutilizables
│   │   ├── use-players.hook.ts
│   │   └── use-intersection-observer.hook.ts
│   ├── types/                  # Interfaces TypeScript
│   └── utils/                  # Funciones puras helper
├── core/
│   ├── theme/                  # Tema MUI personalizado
│   └── providers/              # AppProviders (QueryClient + ThemeProvider)
├── pods/                       # Feature modules
│   ├── player-list/
│   │   ├── components/
│   │   ├── player-list.container.tsx
│   │   └── player-list.component.tsx
│   └── player-detail/
│       ├── components/
│       ├── player-detail.container.tsx
│       └── player-detail.component.tsx
├── scenes/                     # Páginas / rutas
│   └── home.scene.tsx
└── test/
    ├── mocks/                  # Fixtures + MSW server
    └── unit/                   # Tests unitarios
```

### Patrón scenes / pods / container / component

- **Scene**: corresponde a una ruta. Orquesta pods.
- **Pod**: feature module auto-contenido. Todo el código de una funcionalidad vive aquí.
- **Container**: lógica de datos, estado derivado, efectos, callbacks.
- **Component**: render puro. Recibe props.

---

## Decisiones técnicas

### TanStack Query v5 (useInfiniteQuery)

Elegido por:
- Manejo declarativo de loading / error / success
- Cache automático: `staleTime` 5 min + `gcTime` 30 min — si falla la red, se sirven datos cacheados
- `useInfiniteQuery` simplifica la paginación acumulativa
- Deduplicación de peticiones automática

### Infinite scroll con Intersection Observer

Custom hook `useIntersectionObserver` con `rootMargin: 300px`. El sentinel (elemento invisible al final de la lista) dispara la siguiente página antes de que el usuario llegue al fondo, eliminando parpadeos.

### MUI v7 — tema dark personalizado

Paleta inspirada en los colores de EA FC (dorado `#c6a227`, fondo oscuro). Sistema de theme para tokens de color consistentes. Componentes MUI usados: `Card`, `Typography`, `Avatar`, `Chip`, `TextField`, `CircularProgress`, `Alert`, `LinearProgress`, `Drawer`, `Skeleton`, `Grid`.

### Estrategia de caché / offline

| Escenario | Comportamiento |
|-----------|----------------|
| Primera carga | Fetch real a la API |
| Recarga / misma sesión (< 5 min) | Cache en memoria |
| Pérdida de red después de carga | Datos disponibles 30 min |
| Error en carga inicial | Alert con botón "Reintentar" |

---

## Estrategia de paginación

La API devuelve `totalItems: 17873`. Se envían parámetros `offset` y `limit=25` en cada request. `getNextPageParam` calcula el siguiente offset sumando los items ya cargados. Si `fetched >= totalItems`, devuelve `undefined` y la carga termina.
---

## Testing

**Vitest** + **React Testing Library** + **MSW** (intercepta fetch).

```bash
npm run test
```

Cobertura:
- Funciones puras (`player.utils`)
- Componente de tarjeta (`PlayerCard`)
- Drawer de detalle (`PlayerDetail`)
- Integración container + lista (`PlayerListContainer`): loading, success, filtro, error, retry
- Custom hook (`usePlayers`): isLoading, players, totalItems, hasNextPage

---

## Trade-offs y mejoras con más tiempo

| Aspecto | Estado actual | Mejora |
|---------|--------------|--------|
| Persistencia offline | Cache en memoria (30 min) | `@tanstack/query-persist-client-core` + IndexedDB |
| Virtualización | DOM completo | `@tanstack/react-virtual` para listas >500 items |
| Tests e2e | Sin tests e2e | Playwright |
| Filtros | Solo nombre | Posición, rating mínimo, liga, nación |
| Error boundary | Sin error boundary global | ErrorBoundary en el árbol |
| Deploy | Solo local | Vercel / Netlify CI/CD |

