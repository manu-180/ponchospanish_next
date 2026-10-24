# Portada del curso "Spanish for Confident Teens"

`cover.html` es la fuente de `../Spanish-for-Confident-Teens-portada.jpg` (1280x720, 16:9).
Mismo esquema que la portada de Kids que mandó Anto: fondo #191A12, notebook, título en
Anton crema (#E1DDD2) y bajada manuscrita en mostaza (#E8A84C).

Para re-renderizar hace falta la foto del libro al lado del HTML:

```bash
cp scripts/ebooks/photos/confident-teens-cover.jpg photo.jpg
chromium --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1280,720 \
  --screenshot=shot.png "file://$PWD/cover.html"
convert shot.png -resize 1280x720 -colorspace sRGB -strip -quality 93 portada.jpg
```

Para otro curso: cambiar el `<h2>`, la bajada y `photo.jpg`.
