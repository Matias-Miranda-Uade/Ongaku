# Redux del catálogo y las reseñas

Los slices usan `createAsyncThunk`, `createSlice`, `extraReducers` y casos
`builder.addCase` explícitos para pending, fulfilled y rejected. Las demos del
profesor no están incluidas en este repositorio; se siguieron las convenciones
indicadas en la solicitud, sin afirmar una comparación con sus archivos.

## Datos y componentes

- `catalog.items` es el array compartido de vinilos. `ids` conserva el orden del
  listado del servidor y distingue ese listado de un detalle cargado directamente.
  Catálogo, detalle, curaduría y sugerencias utilizan los mismos objetos.
- `reviews.items` es el array compartido de reseñas. Las vistas y mis reseñas
  guardan únicamente sus identificadores, sin duplicar los objetos.
- Los componentes leen el slice con `useSelector` y calculan las listas con
  funciones normales. No se utiliza `createSelector` ni se guardan los filtros
  o las listas filtradas en Redux. Los formularios mantienen su estado local.
- Los thunks dejan que Redux Toolkit genere `action.error.message` cuando falla
  la API. Ya no hay `rejectWithValue` ni bloques catch que sólo reenvían el error.
- Edición y eliminación tienen sus seis casos escritos individualmente.
  `ReviewCard` sigue recibiendo la reseña por props y no necesita acceder a Redux.
- Los formularios de reseñas revisan `result.error` luego del dispatch, igual que
  `OrderRating`. Ya no necesitan `.unwrap()` ni la utilidad `getMessage`.

## Protecciones conservadas y motivos

Estas protecciones están limitadas a solicitudes y consistencia. Las pruebas
`redux-catalog-reviews.test.js` reproducen los cruces de respuestas que cubren.

- `condition` impide duplicar GET en curso y enviar dos veces una escritura.
  El control también funciona si dos componentes despachan antes del próximo render.
- La caché compartida de 30 segundos evita repetir llamadas al navegar entre
  catálogo y detalle, o detalle y reseñas. Reintentar y recargar después de una
  escritura permiten forzar la consulta. Se conserva la caducidad existente.
- `requestId` descarta respuestas reemplazadas y resultados privados de una sesión
  anterior. Revisar sólo el usuario no alcanza si cierra sesión y vuelve a entrar.
- `version` y `entityVersions` conservan el dato más reciente cuando se cruzan
  consultas independientes. También recuerdan eliminaciones: una lectura pendiente
  no puede volver a agregar una reseña o un vinilo retirado. No son versiones de
  la API; son contadores locales del orden de las solicitudes y escrituras.
- `queries` conserva identificadores, promedio, total y estado de cada consulta
  pública. La consulta general y la de un vinilo son endpoints independientes;
  se conserva el promedio del backend y el orden de publicación. Estos metadatos
  evitan descargar todas las reseñas para mostrar un solo álbum.
- `mutations` conserva el estado de edición/borrado por reseña. Permite operar
  sobre reseñas distintas y bloquea escrituras duplicadas sobre la misma.
- La elegibilidad sigue consultándose al backend para el usuario y vinilo
  correspondientes. El servidor valida compras entregadas, autoría y permisos.
  Cambiar de sesión limpia los datos privados y sus solicitudes pendientes.

Las escrituras confirmadas actualizan el array compartido antes de recargar sólo
las consultas utilizadas del vinilo afectado. Si esa recarga falla, se informa
el error de lectura sin afirmar que la escritura falló.

## Stock y elección aleatoria

`catalogSlice` escucha `createOrder.fulfilled` y `cancelOrder.fulfilled` para
actualizar el stock en el array compartido, sin modificar el módulo de órdenes
ni agregar llamadas a la API. Las lecturas anteriores no pisan ese stock.

El botón «Elegir un álbum al azar para escuchar» usa los filtros y la colección
actuales. Elige sólo vinilos con muestra de audio o enlace de álbum y abre su
detalle con el reproductor existente. Se deshabilita durante la carga, ante
errores o si no hay candidatos. La reproducción se inicia con el control del
reproductor; no se fuerza autoplay ni se descargan audios al elegir.

Validación del frontend desde `client/marketplace`: `npm test` y `npm run build`.
Validación adicional del proyecto Java desde la raíz: `mvn -B -o package`.

## Descubrimiento en Home y productos de órdenes

`RandomAlbum` consulta el catálogo compartido con `useSelector` y conserva sólo
el identificador seleccionado con `useState`. `chooseRandomAlbum` utiliza
`Math.random()` y excluye el álbum anterior si hay otra preview disponible.
La Home no vuelve a pedir un catálogo ya cargado. Los datos de cada preview se
obtienen con el endpoint de audio existente al seleccionar un álbum.

Se reutilizan `VinylCover`, `AudioPreview`, `MediaPlayer` y `AudioPlayer`.
El módulo `playback.js` guarda una única función para detener el reproductor
activo. Al comenzar otro, pausa el audio anterior o desmonta su iframe.
Los reproductores externos se activan con un botón explícito, porque no exponen
un evento de reproducción común entre plataformas. Luego se utilizan sus
controles habituales para reproducir, pausar y reanudar. No hay autoplay.

`OrderItem` utiliza exclusivamente los datos reales de la orden: portada, nombre,
artista, cantidad, precio y subtotal. Si falta la portada, usa el fallback de
`VinylCover`; no pide el catálogo ni altera pagos, estados o acciones.

La rama solicitada no contiene `ReservationNotice` ni la corrección reciente de
tarjetas duplicadas, presentes en `redux-correciones`. Por decisión del usuario
no se integraron esas ramas. `OrderDetailPage`, `DemoPaymentForm`,
`CancelOrderButton` y `ordersSlice` permanecen intactos respecto de esta rama.
Por ello no se afirma haber probado un temporizador inexistente en ella.

Las pruebas `discovery-playback.test.js` cubren la elección sin repetición,
la ausencia de previews y la exclusión entre reproductores. No hay script de
lint configurado en `package.json`.

## Archivos afectados por las tres tareas

- Redux: `slices/catalogSlice.js`, `slices/reviewsSlice.js`, `requestState.js` y
  este `README.md`.
- Páginas: `CatalogPage.jsx`, `HomePage.jsx`, `ReviewsPage.jsx`,
  `VinylDetailPage.jsx` y la lectura compatible de reseñas en `OrdersPage.jsx`.
- Reseñas: `ReviewComposer.jsx` y `ReviewActions.jsx`.
- Integración de catálogo: `components/cart/SuggestedProducts.jsx` adapta
  exclusivamente la lectura del array compartido.
- Productos de órdenes: `components/order/OrderItem.jsx` y `OrderItem.css`.
- Home: `components/home/RandomAlbum.jsx`, `chooseRandomAlbum.js` y
  `src/discovery.css`.
- Audio: `AudioPreview.jsx`, `AudioPlayer.jsx`, `MediaPlayer.jsx` y `playback.js`.
- Pruebas: `redux-catalog-reviews.test.js` y `discovery-playback.test.js`.

Además de las pruebas, se comprobó el renderizado con React de la portada,
fallback, cantidades, importes, datos faltantes y estados vacío/disponible de
descubrimiento. Esto no sustituye una prueba visual o de audio en navegador:
el host de automatización del navegador no estuvo disponible en esta sesión.
