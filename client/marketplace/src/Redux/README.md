# Estado global con Redux Toolkit

## Estructura

- `store.js` configura el store y registra los reducers de `cart`, `orders` y `reviews`. Redux Toolkit ya incorpora el middleware thunk.
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

`reviewsSlice` ya incluye la carga de “mis reseñas”, la creación desde las órdenes y los borradores del formulario `OrderRating`. Para la migración general todavía falta sumar reseñas por vinilo, editar, borrar y elegibilidad. Los siguientes pasos naturales son agregar thunks como `fetchReviewsByVinyl`, `updateReview` y `deleteReview`, y migrar `ReviewsPage`, `ReviewComposer` y `ReviewActions` para consumir este slice. Las funciones HTTP de la API ya están disponibles para reutilizarlas.
