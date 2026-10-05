# KØRE — instrucciones para el agente

## Deploy

- **Siempre commitear y pushear a `origin master` al terminar cada cambio**, sin
  pedir confirmación previa. El push a GitHub dispara el deploy de Vercel.
- Antes de commitear: revisar `git status` y `git diff`, y stagear solo lo
  intencional (`.vercel/` ya está en `.gitignore`).
- Estilo de commits del repo: una línea en español, en impersonal y sin punto
  final. Ej.: `Agrega 5 productos de Corteiz a la seccion Shorts`.

## Sitio

- HTML/CSS/JS estático sin build: `index.html`, `styles.css`, `app.js`.
- No hay lint ni tests. Verificar con `vercel ls` que el deploy quedó `Ready`.

## Productos

- Cada producto tiene una entrada en `productData` (`app.js`) y una card en
  `index.html` con `data-product` igual a la clave.
- El selector de corte (Normal / 3/4) y la disponibilidad de colores por corte
  se aplican solos cuando `category: 'shorts'` (ver `getCortes` y
  `CORTE_COLOR_RULES`). No hace falta configurarlo a mano.
- Imagenes de productos nuevos: `img/` y nomenclatura abreviada por marca y
  variante, ej. `ctz-gde-bla-shorts-1.png`. Se descargan de Drive con
  `curl.exe -sL -o <dest> "https://drive.google.com/uc?export=download&id=<ID>"`.
- Talles de shorts: `1` a `5`. `outOfStock` marca talles sin stock.
