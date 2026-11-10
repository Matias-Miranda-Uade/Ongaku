# Estado global con Redux Toolkit

La estructura sigue los ejemplos Demo Redux y Demo Redux II: `configureStore`,
`Provider`, `createAsyncThunk`, `createSlice`, `extraReducers`, `useDispatch` y
`useSelector`. Cada slice declara sus operaciones as?ncronas antes del reducer,
sin archivos de acciones separados. Las solicitudes reutilizan `services/api.js`
para conservar la autenticaci?n, las rutas y los errores del backend de Ongaku.

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
- `requestState.js`: utilidades compartidas de solicitudes y claves de consultas.

Curadur?a (`HomePage`) carga el cat?logo con `fetchVinyls` y utiliza
`selectCuratedCollections` para mostrar el total por colecci?n. Cada colecci?n
abre `/app/catalog?collection=...`, que filtra las mismas entidades. Los textos
editoriales permanecen en `data/collections.js`. La vitrina administrativa es
una secci?n distinta.

Los filtros, formularios y controles visuales usan estado local; los datos del
servidor viven en Redux. No hay servicios intermediarios que solo reexporten la API.

Validaci?n desde `client/marketplace`: `npm test` y `npm run build`.
