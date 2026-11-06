# SEO de Poncho Spanish — 8 de septiembre de 2026

## Estado

Cambios implementados y verificados en el proyecto local. No se realizó commit, push ni despliegue. El dominio publicado conserva la versión anterior hasta publicar estos cambios.

## Trabajo realizado

- Sitemap: de 3 URLs estáticas a 10 URLs verificadas, incluidas 5 páginas nuevas, el curso publicado y el workbook publicado. El catálogo se consulta con permisos anónimos, filtro de publicación y paginación keyset. Las fechas de productos corresponden a `updated_at`; no se inventan fechas para páginas estáticas.
- Nuevas páginas: `/spanish-lessons`, `/spanish-lessons/children`, `/spanish-lessons/gcse`, `/spanish-lessons/home-education` y `/spanish-lessons/adults`. Contenido propio para cada intención, precios existentes, preparación de la clase de prueba, preguntas frecuentes y enlaces a servicios relacionados.
- Canonicals de producción, títulos y descripciones propios, Open Graph/Twitter completos, noindex explícito en acceso/áreas privadas y previews. Robots permite rastrear las etiquetas noindex y excluye las APIs.
- Schema de organización, docente, servicios, cursos, productos, FAQ y breadcrumbs. Se quitaron la dirección británica no acreditada, duraciones inventadas y métricas promocionales sin respaldo. JSON-LD escapa entradas que podrían cerrar el elemento script.
- Home, servicios y catálogo prerenderizados. Cursos con ISR; ebooks mantienen autorización y compra en servidor. Los errores de catálogo/currículum se propagan para evitar reemplazar contenido válido por resultados vacíos.
- FAQ nativas y contenido público visible sin JavaScript. Se retiraron los `loading.tsx` públicos que envolvían el contenido en segmentos ocultos de streaming. Las rutas privadas conservan sus controles de sesión.
- Videos con descarga según visibilidad y respeto a movimiento reducido; posters derivados de los videos reales. Icono principal de 142.505 a 11.747 bytes. Dimensiones reales de imágenes, contraste y etiquetas de formulario corregidos.
- Contenido principal del hero sin animaciones de entrada que retrasaban su render; se mantienen interacciones y efectos decorativos.

## Verificación reproducible

```powershell
npm run build
npm run test:seo
npm run start
```

Con el servidor iniciado, desde otra terminal:

```powershell
npm run seo:audit -- --base http://localhost:3000 --output docs/seo/final-audit.json
```

Después de publicar, repetir contra el dominio:

```powershell
npm run seo:audit -- --base https://www.ponchospanish.com
```

El auditor recorre todas las URLs del sitemap y comprueba HTTP, H1, metadatos, canonicals, JSON-LD, enlaces/fragmentos internos, redirección heredada de `/courses`, 404, noindex de login/signup, redirecciones anónimas de áreas privadas e iconos/imagen social.

Las 8 pruebas de `test:seo` cubren datos estructurados, imágenes inválidas, ratings inválidos, metadatos de previews, escape de JSON-LD, catálogo de más de 500 elementos y propagación de errores. El mock de caché comprueba propagación; no simula una caída real de Supabase durante una revalidación ISR.

Playwright recorre las 10 páginas a 375, 768 y 1280 px, carga las imágenes al hacer scroll, comprueba consola, menú móvil, desbordes, movimiento reducido y contenido sin JavaScript. Evidencia en [browser-audit.json](seo/browser-audit.json) y capturas del mismo directorio.

## Evidencia y límites

Comparación de las mediciones locales inicial y final con Lighthouse 13.4.1:

| Métrica | Inicial | Final |
|---|---:|---:|
| Rendimiento | 81 | 89 |
| Accesibilidad | 91 | 100 |
| Buenas prácticas | 96 | 100 |
| SEO básico Lighthouse | 100 | 100 |
| Largest Contentful Paint | 4,8 s | 3,7 s |
| Total Blocking Time | 100 ms | 90 ms |
| Cumulative Layout Shift | 0 | 0,013 |
| Transferencia total inicial móvil | 4.869 KiB | 489 KiB |

La transferencia bajó aproximadamente un 90 %. El LCP de laboratorio todavía supera 2,5 s: no se afirma aprobación completa de Core Web Vitals. La home ya tenía 100 en la categoría SEO básica de Lighthouse, aunque el rastreo propio encontraba 11 fallos; ese puntaje no mide posicionamiento ni sustituye el rastreo del sitio completo.

- [Auditoría del dominio antes de los cambios](seo/baseline-audit.json): 11 fallos en 3 URLs incluidas en su sitemap.
- [Auditoría del proyecto actualizado](seo/final-audit.json): 10 URLs públicas; resultados completos y fecha en el archivo.
- [Lighthouse inicial local](seo/lighthouse-before.json), [dominio publicado](seo/lighthouse-production-baseline.json) y [Lighthouse local actualizado](seo/lighthouse-after.json). Son mediciones de laboratorio con Chrome y simulación móvil; no representan datos de usuarios reales ni una mejora de posiciones en Google. La primera ejecución CLI guardó el informe pero devolvió EPERM al limpiar su directorio temporal; se repitió la medición con Chrome administrado por Playwright y salida correcta.
- Los cinco avisos de `react-hooks/exhaustive-deps` en `components/admin/subtitle-editor.tsx` existían antes del trabajo y están fuera de este alcance.
- No se verificaron las políticas RLS desplegadas ni los índices reales de Supabase. Las migraciones locales no permiten afirmar qué índices existen; no se aplicó una migración sin esa evidencia.
- No se probaron compras ni sesiones con cuentas reales. La revisión de seguridad del diff no encontró fallos nuevos y se comprobaron las redirecciones de visitantes anónimos.
- No se dispone aquí de datos de Search Console sobre impresiones, consultas, clics o posiciones. No se inventaron volúmenes de búsqueda ni resultados de posicionamiento.

## Próximo ciclo después de publicar

1. Ejecutar el auditor contra producción y validar curso, ebook y servicios con la herramienta de inspección de URLs de Search Console.
2. Enviar o revisar el sitemap en Search Console y comprobar su lectura. Evitar envíos repetidos de las mismas URLs sin cambios relevantes.
3. Medir impresiones, consultas y conversiones por página, separando búsquedas de marca de búsquedas de servicios. Ajustar contenido a consultas reales cuando haya datos suficientes.
4. Ampliar contenido sólo si existe una intención distinta y material útil propio: no generar páginas repetitivas por ciudad o variaciones mínimas de palabras clave.
5. Verificar Core Web Vitals de usuarios reales y los índices de las consultas públicas antes de definir nuevas optimizaciones de infraestructura.

## Fuentes utilizadas

- [Google: construcción y envío de sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- [Google: datos estructurados de cursos](https://developers.google.com/search/docs/appearance/structured-data/course).
- [Google: datos estructurados de productos](https://developers.google.com/search/docs/appearance/structured-data/product-snippet).
- [Next.js: sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) y [JSON-LD](https://nextjs.org/docs/app/guides/json-ld).
- [AQA GCSE Spanish 8692](https://www.aqa.org.uk/subjects/spanish/gcse/spanish-8692/specification) y [Pearson Edexcel GCSE Spanish](https://qualifications.pearson.com/en/qualifications/edexcel-gcses/spanish-2024.html), enlazados en la página de apoyo a exámenes.
