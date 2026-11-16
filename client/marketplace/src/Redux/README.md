# Estado global con Redux Toolkit

La estructura sigue los ejemplos Demo Redux y Demo Redux II: `configureStore`,
`Provider`, `createAsyncThunk`, `createSlice`, `extraReducers`, `useDispatch` y
`useSelector`. Cada slice declara sus operaciones as?ncronas antes del reducer,
sin archivos de acciones separados. Las solicitudes reutilizan `services/api.js`
para conservar la autenticaci?n, las rutas y los errores del backend de Ongaku.

- `authSlice.js`: login, registro, recuperaci?n y cierre de sesi?n, y edici?n del
  perfil. `selectAuth` expone el usuario y sus permisos a toda la aplicaci?n.
  Los estados de carga y errores de estas operaciones tambi?n viven en Redux;
  el token conserva la persistencia existente en localStorage.
- `catalogSlice.js`: carga del cat?logo y detalles, b?squeda, stock, ordenamiento
  y colecciones de curadur?a. Listado, detalle, sugerencias y curadur?a comparten
  una entidad por vinilo. Los selectores derivan las vistas sin copiar los datos
  a estados locales. La cach? evita repetir solicitudes durante 30 segundos;
  los botones de reintento fuerzan una nueva carga.
- `reviewsSlice.js`: consultas p?blicas y personales, elegibilidad y creaci?n,
  edici?n y eliminaci?n de rese?as. Cada rese?a se guarda una sola vez y las
  consultas conservan sus identificadores. Las escrituras sincronizan las vistas
  utilizadas y sus estad?sticas. El cambio de sesi?n limpia los datos privados
  y descarta respuestas anteriores. El backend valida los permisos y las compras.
- `cartSlice.js` y `ordersSlice.js`: conservan las operaciones de carrito y ?rdenes.
- `adminCatalogSlice.js`: datos del panel de administración sobre vinilos. Listado
  y detalle administrativos, artistas, géneros, categorías y previews de audio, y
  las escrituras (alta, edición, publicación, stock y borrado de vinilos; alta y
  borrado de artistas, géneros y categorías; alta de previews). Al borrar un
  artista, género o categoría sus vinilos se conservan sin esa relación. Cada vinilo se guarda una sola vez; inventario,
  vitrina, dashboard y formulario derivan sus vistas con selectores. El estado de
  cada escritura se guarda por vinilo para deshabilitar sólo las filas afectadas.
  Si el catálogo público ya se cargó, se renueva después de cada escritura.
- `adminOrdersSlice.js`: todas las órdenes, el resumen del dashboard y el cambio
  de estado de una orden, que renueva el resumen si ya estaba cargado.
  Ambos slices de administración se vacían al iniciar o cerrar sesión y usan la
  misma caché de 30 segundos; "Actualizar" y "Reintentar" fuerzan la carga. Los
  errores de escritura conservan el estado HTTP y los errores por campo
  (`getErrorDetails`) para que el formulario marque los campos rechazados.
- `requestState.js`: utilidades compartidas de solicitudes y claves de consultas.

Curadur?a (`HomePage`) carga el cat?logo con `fetchVinyls` y utiliza
`selectCuratedCollections` para mostrar el total por colecci?n. Cada colecci?n
abre `/app/catalog?collection=...`, que filtra las mismas entidades. Los textos
editoriales permanecen en `data/collections.js`. La vitrina administrativa es
una secci?n distinta: el modo por lotes, la selección y los cambios pendientes
son estado local, y los vinilos y el guardado viven en `adminCatalogSlice`.

Los filtros, formularios y controles visuales usan estado local; los datos del
servidor viven en Redux. No hay servicios intermediarios que solo reexporten la API.

Validaci?n desde `client/marketplace`: `npm test` y `npm run build`.
