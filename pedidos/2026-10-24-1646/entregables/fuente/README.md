# Portada del curso "Spanish for Confident Teens"

`cover.html` es la fuente de `../Spanish-for-Confident-Teens-portada.jpg` (1280x720, 16:9).
Mismo esquema que la portada de Kids que mandó Anto: fondo #191A12, notebook, título en
Anton crema (#E1DDD2) y bajada manuscrita en mostaza (#E8A84C).

Bajada actual, la que pidió Anto el 24/10: "A Self-Paced Spanish Programme for the Early
Years of Secondary School". Es más larga que la anterior, así que la bajada bajó de 38px a
33px para entrar en una sola línea dentro de la pantalla (902px). Si se cambia el texto,
revisar que `.sub` siga entrando: con `white-space:nowrap` no corta, se desborda.

Para re-renderizar hace falta la foto del libro al lado del HTML:

```bash
cp scripts/ebooks/photos/confident-teens-cover.jpg photo.jpg
chromium --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1280,720 \
  --screenshot=shot.png "file://$PWD/cover.html"
convert shot.png -resize 1280x720 -colorspace sRGB -strip -quality 93 portada.jpg
```

Para otro curso: cambiar el `<h2>`, la bajada y `photo.jpg`.
