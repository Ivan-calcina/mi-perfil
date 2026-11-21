# ✦ VANTA Profile Studio

Un sitio personal estilo *link in bio* inspirado en la idea de personalización de guns.lol, pero con identidad, diseño y código originales. Es para uso personal: **sin cuentas, sin base de datos, sin frameworks y compatible con GitHub Pages**.

## Archivos

| Archivo | Uso |
|---|---|
| `index.html` | Perfil que verán los visitantes |
| `editor.html` | Editor visual con vista previa |
| `config.json` | Configuración PÚBLICA que utiliza el perfil |
| `styles.css` | Estilos del perfil y editor |
| `profile.js` | Renderizado de la página y efectos |
| `editor.js` | Interacción y exportación del editor |
| `.nojekyll` | Evita procesamiento innecesario en Pages |

## 1. Publicar en GitHub

1. Accede a [github.com/new](https://github.com/new) y crea un repositorio (por ejemplo, `mi-perfil`). Un repositorio **público** es lo más sencillo para comenzar con GitHub Pages.
2. Abre el repositorio → **Add file** → **Upload files**.
3. Extrae el ZIP y **sube los archivos que contiene**, no el ZIP como único archivo. `index.html` debe quedar en la raíz del repositorio, junto a `config.json`.
4. Confirma la subida con **Commit changes**.
5. Abre **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
6. Elige **Branch: main**, carpeta **/(root)** y guarda.
7. GitHub mostrará un enlace con formato `https://TU-USUARIO.github.io/mi-perfil/` cuando se publique.

> GitHub Pages publica una web estática: el código y los datos publicados son accesibles a los visitantes. **No pongas contraseñas, tokens, datos privados o claves API** en `config.json` o el código. Si solo lo quieres ver tú, no publiques el sitio y ejecútalo localmente.

## 2. Personalizar

1. Visita `https://TU-USUARIO.github.io/mi-perfil/editor.html` o abre `editor.html` en tu equipo.
2. Cambia nombre, foto, texto, fondos, efectos, música, enlaces y widgets. Verás los cambios en la vista previa.
3. El editor guarda automáticamente un **borrador en el navegador** mediante `localStorage`, pero **esto NO actualiza GitHub**.
4. Haz clic en **Exportar JSON** para descargar un nuevo archivo `config.json`.
5. En tu repositorio, abre el archivo **config.json** y reemplaza su contenido con el contenido del archivo descargado (puedes editarlo desde el icono del lápiz), o sube el archivo para reemplazar el existente. Confirma con **Commit changes**.
6. Recarga la página pública para ver los cambios.

> El borrador se guarda solo en ese navegador, no se sincroniza con otros equipos. Puedes importarlo o exportarlo desde **Avanzado**. No existe login en `editor.html`: cualquier persona que abra esa URL puede experimentar con un borrador en **su propio navegador**, pero no puede alterar tu web publicada sin permisos en GitHub.

## 3. Probar en tu PC sin publicarlo

Puedes abrir `editor.html` directamente. Para probar `index.html` con la configuración real, es mejor ejecutar un servidor local sencillo, pues algunos navegadores bloquean las solicitudes JSON cuando se usa `file://`.

```bash
cd vanta-profile-studio
python -m http.server 5500
```

Visita `http://localhost:5500/editor.html` o `http://localhost:5500/`.

## Funciones incluidas

- 6 paletas de colores y colores personalizados.
- Ajustes de tipografía, transparencia, desenfoque, redondeo, resplandor y alineación.
- Efectos de fondo: estrellas, nieve, lluvia, luciérnagas y burbujas; intensidad ajustable.
- Estela del cursor, luces ambientales, inclinación al mover el mouse y títulos animados.
- Fondos de imagen o video, avatar y reproductor de audio (URL directa).
- Pantalla de bienvenida opcional.
- Insignias, estado, ubicación de texto, hora local, habilidades, frase y proyectos.
- Gestor de enlaces (agregar, editar, reordenar, mostrar u ocultar).
- Editor de CSS, exportación/importación de JSON y vista previa móvil.

## Multimedia

- Para fondo, avatar y música, usa direcciones HTTPS **directas** a archivos o sube imágenes, audio y video a una carpeta `assets` de tu repositorio y usa rutas como `./assets/fondo.jpg`.
- Un enlace normal de Spotify, YouTube, Google Drive o una página de vista previa **no es** un archivo MP3/MP4 directo.
- La música requiere que el visitante pulse reproducir. Muchos navegadores bloquean sonido automático.
- Los archivos grandes de video aumentan el peso de la página; comprímelos.

## Límites de GitHub Pages

GitHub Pages solo aloja archivos estáticos. No incluye, por sí mismo, cuentas de usuarios, sincronización instantánea del editor, métricas reales de visitas, presencia de Discord o subida de archivos desde el panel. Estas funciones requieren servicios adicionales o un backend, que no forman parte de este proyecto.

## Nota sobre guns.lol

Este proyecto no es afiliado a guns.lol y no copia logotipos, recursos privados ni código propietario. Se creó como una alternativa de diseño personal con funcionalidades similares de personalización.
