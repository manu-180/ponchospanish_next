# Estado del proyecto

## 2026-09-08 — SEO, contenido y rendimiento

Se implementó una ronda extensa de auditoría, correcciones y revisión independiente. Detalle y evidencia en [SEO.md](SEO.md).

Build final y 8 pruebas SEO aprobados. Auditoría HTTP: 10 URLs sin errores ni advertencias. Lighthouse local final: rendimiento 89, accesibilidad 100, buenas prácticas 100, SEO 100; LCP 3,7 s y descarga inicial móvil 489 KiB. Quedan cinco warnings previos del editor de subtítulos.

La home, el hub de clases, sus cuatro servicios y el catálogo público son estáticos; los cursos usan ISR. La página de ebook sigue personalizada en servidor para conservar el acceso a compras. No introducir cookies en el layout marketing: volvería dinámicas las páginas públicas. La sesión del header se reconcilia en cliente y la autorización real continúa en servidor.

Los datos del sitemap usan sólo el cliente anónimo y filas publicadas. Los fallos de datos deben propagarse: devolver arrays vacíos al fallar sustituye contenido válido en ISR. Las fechas del sitemap no deben representar la hora de cada build.

Las FAQ y el contenido SEO deben existir y ser visibles sin JavaScript. No reintroducir opacity inicial cero o límites de loading que escondan páginas públicas completas. El H1 del hero debe permanecer estable durante la primera carga.

Queda pendiente publicar los cambios y validar indexación/rendimiento real en Search Console. No se modificaron datos de producción ni se aplicaron migraciones.
