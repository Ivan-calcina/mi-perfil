# VANTA Profile Studio — Modo Bosque Nocturno

Este es un proyecto personal y estático inspirado en la composición de perfiles tipo guns.lol. **No es una copia de la plataforma ni utiliza sus archivos privados.**

## Publicación en tu GitHub Pages

1. Abre `https://github.com/Ivan-calcina/mi-perfil`.
2. En **Code → Add file → Upload files**, sube el **contenido del ZIP descomprimido** directamente en la raíz del repositorio (donde está `index.html`).
3. Confirma **Commit changes** y conserva **Settings → Pages → main / (root)**.
4. Perfil: `https://ivan-calcina.github.io/mi-perfil/`. Editor: `https://ivan-calcina.github.io/mi-perfil/editor.html`.
5. En el editor, exporta `config.json` y reemplaza el archivo del repositorio para publicar los cambios. Los borradores locales no se publican solos.

## Edición

- **Identidad:** nombre, avatar, subtítulo, biografía y ubicación.
- **Apariencia:** modo `Bosque nocturno` para el diseño de la captura; los modos `Compacto` y `Amplio` mantienen el diseño anterior.
- **Efectos:** luces, estrellas, nieve, lluvia, etc.
- **Multimedia:** imagen o video de fondo, canción MP3/OGG/WAV directa, título, artista y portada.
- **Enlaces:** gestiona los iconos de tus redes sociales (incluido Xbox).
- **Widgets:** tarjeta destacada translúcida con nombre, subtítulo e imagen.

Las direcciones de Discord, Steam, Xbox, Spotify, Twitch y TikTok son **ejemplos genéricos**: personalízalas con tus enlaces. La imagen de fondo usa Unsplash; si no carga, se muestra una ilustración SVG propia del proyecto (`forest-fallback.svg`). La música no se reproduce automáticamente por las restricciones habituales del navegador: hay que proporcionar un archivo válido y pulsar reproducir.

## Archivos

- `index.html`: página pública
- `editor.html` y `editor.js`: panel visual
- `profile.js`: motor de perfil clásico y valores por defecto
- `forest.js` y `forest.css`: nuevo modo Bosque nocturno
- `forest-fallback.svg`: fondo alternativo sin conexión a servicios externos
- `styles.css`: estilos originales
- `config.json`: configuración publicada
- `.nojekyll`: sirve archivos estáticos directamente en Pages

Este repositorio de GitHub Pages es **público**; no agregues datos privados ni claves en los archivos.
