# Pokédex MVP

Aplicación web construida con React, Vite y Tailwind siguiendo las directrices del MVP definidas en `../mvp.md`.

## Requisitos

- Node.js 18+
- npm 9+

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

## Despliegue en GitHub Pages

Este repositorio incluye un flujo de trabajo automático (`.github/workflows/deploy.yml`) que publica la aplicación en GitHub Pages cada vez que haces push a la rama `main`.

1. Crea el repositorio en GitHub y empuja el código (`git remote add origin ...`, `git push -u origin main`).
2. En la pestaña **Settings → Pages** selecciona **GitHub Actions** como fuente del sitio.
3. Si tu repositorio **no** es del tipo `usuario.github.io`, la acción ajustará el `base` de Vite automáticamente usando el nombre del repositorio (`https://usuario.github.io/<repo>/`).
4. Si usas un repositorio `usuario.github.io`, no necesitas pasos extra: la acción compilará con `base: '/'`.
5. Cada nuevo push a `main` disparará el build (`npm run build`) y desplegará el contenido de `dist` en Pages.

Puedes forzar un despliegue manual desde la pestaña **Actions → Deploy to GitHub Pages → Run workflow**.

## Arquitectura

- `src/App.tsx`: layout principal y composición de vistas.
- `src/features/pokemon`: componentes, hooks y utilidades relacionados con Pokémon.
- `src/services`: capa de acceso a datos (PokéAPI).
- `src/store`: gestión de estado local (favoritos y preferencias).
- `src/types`: modelos TypeScript compartidos.

## Funciones avanzadas actuales

- **Comparador de Pokémon**: busca hasta tres especímenes y compara sus estadísticas base.
- **Recomendador de equipos**: genera combinaciones para hasta tres tipos seleccionados.
- **Timeline de evoluciones**: muestra condiciones y requisitos de cada etapa.
- **Modo entrenador**: registra resultados de combates y calcula métricas de desempeño.
- **Minijuego trivia**: adivina el Pokémon viendo solo su silueta.

## Roadmap inmediato

### 1. Buscador global y filtros combinables (Semana 1)
- Añadir input con autocompletado por nombre/número y atajos de teclado.
- Implementar filtros por tipo, generación y rango de stats con persistencia en la URL.
- Optimizar las llamadas a PokéAPI con memoización/caché y estados de carga claros.
- Validar la accesibilidad (aria-live para resultados, navegación con teclado).

### 2. Vista de detalle enriquecida (Semana 2)
- Crear ruta dedicada (`/pokemon/:name`) con datos ampliados (stats completos, movimientos, hábitat, generación).
- Reutilizar hooks existentes (`usePokemonDetail`, `useEvolutionTimeline`) y añadir gráficos ligeros para stats.
- Integrar favoritos y acciones rápidas (añadir a equipo recomendado, compartir enlace).
- Escribir documentación breve sobre la arquitectura de la vista.

### 3. Cobertura de pruebas y calidad (Semana 3)
- Añadir pruebas unitarias para hooks (mocks de `react-query`) y componentes avanzados.
- Configurar pruebas de integración/e2e mínimas (Playwright/Cypress) para flujos clave.
- Incorporar analizador de performance (Lighthouse CI o Web Vitals) en la pipeline.
- Establecer umbrales mínimos de cobertura y generar reportes en CI.

### 4. Despliegue continuo y observabilidad (Semana 4)
- Automatizar build y deploy en Vercel/Netlify con branches preview.
- Configurar variables de entorno seguras y monitor de errores (Sentry o similares).
- Activar analítica ligera para búsquedas/favoritos respetando privacidad.
- Documentar runbooks de despliegue y checklist de verificación.

## Créditos

Datos proporcionados por [PokéAPI](https://pokeapi.co/).
