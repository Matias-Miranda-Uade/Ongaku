# Catálogo con portadas reales

`albums.json` registra los doce álbumes, sus fuentes y las portadas descargadas en `client/marketplace/public/covers/real`. Incluye artista, título, año original, género, descripción y una lista de canciones de la edición digital de referencia cuando la fuente la proporciona. Esa lista puede diferir de una edición física; no se atribuye una tirada, remasterización ni cantidad de discos al producto sin verificarla.

Las imágenes y los metadatos provienen del catálogo público de Apple Music/iTunes; las URLs originales figuran en cada registro. Los derechos de las portadas pertenecen a sus titulares. Verificar las autorizaciones correspondientes antes de reutilizarlas en una tienda comercial publicada.

Los precios en pesos, descuentos y cantidades son datos de demostración de Ongaku, no información comercial proporcionada por Apple. Se mantienen los valores actuales de los productos ya existentes.

Para cargar el catálogo en la base configurada del backend, desde la raíz:

```powershell
python catalog/import_catalog.py
```

Requiere Python, Java 21 y el conector MySQL descargado por Maven. Crea primero un respaldo en `backups/`, actualiza portadas y descripciones sin cambiar los IDs, precios ni stock existentes y agrega solo los álbumes que falten. No borra compras, reseñas ni productos. No se ejecuta automáticamente al iniciar el servidor.
