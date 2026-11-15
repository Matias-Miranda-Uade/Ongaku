# Estado global con Redux Toolkit

La estructura sigue los ejemplos Demo Redux y Demo Redux II: `configureStore`,
`Provider`, `createAsyncThunk`, `createSlice`, `extraReducers`, `useDispatch` y
`useSelector`. Cada slice declara sus operaciones asíncronas antes del reducer,
sin archivos de acciones separados. Las solicitudes reutilizan `services/api.js`
para conservar la autenticación, las rutas y los errores del backend de Ongaku.

- `authSlice.js`: login, registro, recuperación y cierre de sesión, y edición del
  perfil. `selectAuth` expone el usuario y sus permisos a toda la aplicación.
  Los estados de carga y errores de estas operaciones también viven en Redux;
  el token conserva la persistencia existente en localStorage.
- `catalogSlice.js`: carga del catálogo y detalles, búsqueda, stock, ordenamiento
  y colecciones de curaduría. Listado, detalle, sugerencias y curaduría comparten
  una entidad por vinilo. Los selectores derivan las vistas sin copiar los datos
  a estados locales. La caché evita repetir solicitudes durante 30 segundos;
  los botones de reintento fuerzan una nueva carga.
- `reviewsSlice.js`: consultas públicas y personales, elegibilidad y creación,
  edición y eliminación de reseñas. Cada reseña se guarda una sola vez y las
  consultas conservan sus identificadores. Las escrituras sincronizan las vistas
  utilizadas y sus estadísticas. El cambio de sesión limpia los datos privados
  y descarta respuestas anteriores. El backend valida los permisos y las compras.
- `cartSlice.js` y `ordersSlice.js`: conservan las operaciones de carrito y órdenes.
- `requestState.js`: utilidades compartidas de solicitudes y claves de consultas.

Curaduría (`HomePage`) carga el catálogo con `fetchVinyls` y utiliza
`selectCuratedCollections` para mostrar el total por colección. Cada colección
abre `/app/catalog?collection=...`, que filtra las mismas entidades. Los textos
editoriales permanecen en `data/collections.js`. La vitrina administrativa es
una sección distinta.

Los filtros, formularios y controles visuales usan estado local; los datos del
servidor viven en Redux. No hay servicios intermediarios que solo reexporten la API.

Validación desde `client/marketplace`: `npm test` y `npm run build`.
