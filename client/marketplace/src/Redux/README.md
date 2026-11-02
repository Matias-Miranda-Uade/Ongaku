# Estado global con Redux Toolkit

## Estructura

- `store.js` configura el store y registra los reducers de `cart`, `orders`, `reviews` y `catalog`. Redux Toolkit ya incorpora el middleware thunk.
- `slices/` define el estado, los reducers síncronos y los `extraReducers` de los thunks. También exporta los selectores de cada dominio.
- `actions/` contiene los thunks con `createAsyncThunk`; estos llaman a las funciones de `services/api.js` y convierten los errores en mensajes serializables.

## Patrón de una operación asíncrona

Las órdenes sirven como ejemplo: `actions/ordersActions.js` declara un thunk con `createAsyncThunk`, y `slices/ordersSlice.js` procesa sus estados `pending`, `fulfilled` y `rejected`. Los componentes usan `useDispatch` para iniciarlo y `useSelector` para leer el resultado. Los thunks de carga usan `condition` para evitar repetir GET ya completados o en curso.

## Cómo agregar otro slice

1. Crear las acciones/thunks en `actions/`, reutilizando las funciones existentes de `services/api.js`.
2. Crear el slice en `slices/`, manejar ahí el ciclo asíncrono y exportar selectores.
3. Registrar el reducer en `store.js`.
4. Conectar los componentes con `useSelector` y `useDispatch`, sin duplicar en estado local datos ya globales.

## Extensión de reseñas

`reviewsActions` conserva `fetchMyReviews` y `createReview`, utilizados por las órdenes, y agrega `fetchReviews`, `fetchReviewEligibility`, `updateReview` y `deleteReview`. Todos reutilizan la API actual. `ReviewsPage`, `VinylDetailPage`, `ReviewComposer` y `ReviewActions` leen Redux con `useSelector` y despachan estos thunks con `useDispatch`.

`reviewsSlice.entities` guarda cada reseña una sola vez. Las consultas públicas y “mis reseñas” mantienen identificadores; los selectores resuelven sus datos. Las consultas por vinilo conservan el promedio y el total enviados por el backend. Crear, editar y borrar renueva únicamente las consultas ya cargadas del vinilo afectado y la consulta global, si existe; también actualiza “mis reseñas” y elegibilidad. Una recarga fallida se informa por separado de una escritura confirmada.

`setReviewOwner` se integra con el efecto de sesión existente en `App`. Cambiar de usuario o cerrar sesión limpia elegibilidad, solicitudes privadas y borradores. Las respuestas antiguas se descartan mediante `requestId`; las reseñas públicas permanecen disponibles para invitados. Los permisos y el requisito de compra entregada siguen siendo responsabilidad del backend.

## Catálogo y curaduría pública

`catalogActions` contiene `fetchVinyls` y `fetchVinylById`. `catalogSlice` comparte las entidades entre listado y detalle, mantiene estados de carga/error por consulta y evita repetir solicitudes en curso o datos obtenidos hace menos de 30 segundos. Los botones de reintento fuerzan una nueva consulta. Los listados y los detalles usan el mismo DTO del backend, por lo que abrir un título ya cargado no requiere otro GET inmediato.

`selectFilteredVinyls` deriva búsqueda por nombre/artista, stock, ordenamiento y colección sin modificar las entidades del store. Los controles de búsqueda, filtros, giro y edición de formularios siguen siendo estado local de interfaz. Favoritos y audio conservan sus componentes e integraciones; agregar al carrito sigue despachando el `addItem` existente.

La navegación “Curaduría” lleva a `/` (`HomePage`). Sus cuatro colecciones proceden de `data/collections.js` y enlazan a `/app/catalog?collection=...`; el catálogo aplica esa colección sobre las entidades compartidas de Redux. Los datos editoriales estáticos y la selección reflejada en la URL no necesitan otro slice ni thunks. `/app/admin/showcase` es una sección administrativa distinta y no se modifica.

## Validación

Desde `client/marketplace`, ejecutar `npm run build` y `npm test`. `tests/redux-catalog-reviews.test.js` prueba los reducers y thunks con la API HTTP sustituida por un adaptador local: caché, búsquedas, stock, precios, colecciones, CRUD, estadísticas, elegibilidad, permisos, respuestas tardías y aislamiento entre cuentas. No modifica la base de datos ni requiere bibliotecas nuevas.
