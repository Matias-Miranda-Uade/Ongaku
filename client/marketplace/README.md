# Frontend de Ongaku

Frontend React de Ongaku. Combina la portada y los flujos de acceso/registro con el catálogo de vinilos, detalle, reseñas, favoritos, carrito, órdenes y perfil.

Desde esta carpeta:

Primero iniciá MySQL y el backend desde la raíz del repositorio en otra terminal:

```powershell
.\mvnw.cmd spring-boot:run
```

Después iniciá el frontend desde `client/marketplace`:

```sh
npm install
npm run dev
```

En PowerShell con scripts deshabilitados, usar `npm.cmd` en lugar de `npm`.

`npm run build` genera la compilación de producción.

Si el backend está apagado, el proxy de desarrollo devuelve 503 y un mensaje para iniciarlo. Mantené abiertas ambas terminales mientras usás la aplicación.

La navegación usa React Router, con rutas de páginas bajo `/app` y detalle de producto en `/app/catalog/:id`. Inicio permite explorar categorías; el catálogo muestra productos y permite abrir el detalle de cada vinilo.

El cliente usa las rutas del backend para autenticación, carrito, órdenes y perfil. El servidor debe estar disponible en `http://localhost:8080`; Vite reenvía las rutas de API durante el desarrollo. Si el backend escucha en otra dirección, definí `VITE_BACKEND_URL` antes de iniciar Vite. Para un despliegue sin proxy, configurá `VITE_API_BASE_URL` con la URL base de la API.

El registro e inicio de sesión guardan el token de acceso y recuperan el perfil desde el backend. El carrito de una sesión autenticada, los favoritos y las órdenes se cargan y actualizan usando la API. Las sugerencias del carrito usan el catálogo real. El carrito solo muestra productos y resumen: al continuar se crea una orden PENDIENTE con `POST /orders`, sin elegir dirección ni tarjeta. Esos datos se completan en el checkout de la orden pendiente. El perfil permite actualizar nombre, apellido, correo y contraseña.

Las direcciones se gestionan en Perfil → Direcciones y se eligen en el checkout pendiente. Al pagar, `POST /payments` envía el `addressId`, el total y, si corresponde, el `savedCardId`. El backend comprueba que la orden esté pendiente, que los datos pertenezcan a la cuenta y que exista una dirección de envío. Guarda una copia de la dirección y registra el pago en la misma transacción. Después de pagar o cancelar desaparecen los formularios del checkout y queda el resumen de la orden. Editar o eliminar una dirección del perfil no cambia las órdenes pagadas.

Las cuentas registradas guardan sus favoritos en `/favorites`. El carrito y los favoritos de visitantes sin sesión son temporales en memoria.

Perfil → Tarjetas permite guardar, editar y eliminar tarjetas de prueba mediante `/users/me/cards`. Se persisten solo titular, marca, últimos cuatro dígitos y vencimiento; no hay campos de base de datos para el número completo ni el código de seguridad. Las tarjetas son privadas de cada comprador y el servidor rechaza tarjetas vencidas o ajenas.

La tarjeta se elige únicamente en el checkout de una orden PENDIENTE. Los controles quedan bloqueados mientras se procesa el pago. El recibo conserva marca y últimos cuatro dígitos aunque luego se elimine la tarjeta del perfil. Sigue siendo un pago simulado, sin cargos ni conexión con una entidad financiera.

Las tarjetas de curaduría de inicio llevan a `/app/catalog?collection=:id`. Las colecciones Rock y alternativo, Jazz, Electrónica y Rock nacional filtran los géneros reales del catálogo y permiten volver a ver todos los vinilos.

Catálogo, detalle de vinilos, reseñas y audio se cargan desde el backend, sin reemplazarlos por datos de prueba cuando hay un error. El catálogo combina `/vinyls` con `/artists`, `/genres` y `/categories` para mostrar sus nombres. El detalle requiere iniciar sesión, según los permisos de la API.

Las reseñas se consultan en `/reviews` y `/reviews/vinyl/:id`; `/app/reviews?vinylId=:id` permite ver las de un producto. La creación desde las órdenes sigue usando `POST /reviews`. El autor puede editar con `PATCH /reviews/:id` y eliminar con `DELETE /reviews/:id`; el administrador puede eliminar para moderar. El backend valida la compra y los permisos.

El detalle permite publicar una reseña cuando `/reviews/vinyl/:id/eligibility` confirma una compra pagada y que no existe otra reseña del mismo autor. En las órdenes, el formulario está disponible desde `PAGADA`, también en `ENVIADA` y `ENTREGADA`. Una orden pendiente o cancelada no habilita reseñas. El estado del pago lo confirma el backend; crear una orden no la marca automáticamente como pagada.

Las tarjetas del catálogo y el detalle muestran las unidades disponibles y el estado sin stock. Los discos agotados permanecen visibles y no pueden agregarse al carrito.

`npm test` verifica las llamadas HTTP, el envío del token y el manejo de errores con respuestas simuladas de la API. No modifica la base de datos.

El frontend utiliza `fetch` y cadenas `.then()`, `.catch()` y `.finally()` para las solicitudes y los formularios. El código de la aplicación en `src` no utiliza funciones `async`, expresiones `await` ni bloques `try/catch`. Las validaciones de enlaces comprueban primero la URL antes de crearla. El checkout sigue funcionando en un entorno de prueba, sin cargos reales, con esa aclaración presentada en una sola nota breve.

Los filtros de `CatalogPage` y `ReviewsPage` se calculan con variables, `if`, `filter` y `sort`. Estas páginas y los componentes de `components/vinyl` y `components/review` no utilizan `useMemo`, `useRef`, `useSearchParams`, encadenamiento opcional ni coalescencia nula. `App` les pasa los datos de navegación como props; se mantienen los enlaces de colecciones y reseñas por vinilo.

En administración, el formulario de vinilos permite crear un artista con «+ Nuevo artista» y selecciona el registro devuelto por `POST /artists`. Los nombres repetidos se seleccionan desde la lista existente.

«Eliminar artista seleccionado» utiliza `DELETE /artists/:id`, reservado a administradores. La confirmación indica qué artista se eliminará; sus vinilos se conservan sin ese artista y las compras mantienen sus datos históricos. La lista y el formulario se actualizan al terminar. También se puede guardar un vinilo como «Sin artista».

En el checkout pendiente se pueden cargar tarjetas antes o después de elegir la dirección. La dirección solo bloquea el botón de confirmar el pago; durante el pago o la cancelación se bloquean todos los controles. Los enlaces a plataformas se muestran dentro de la muestra de audio, sin repetir botones de escucha en la ficha del vinilo ni debajo del reproductor integrado.

«Subir imagen» envía un JPG o PNG de hasta 5 MB y 4096 × 4096 píxeles a `POST /admin/vinyls/covers`. El servidor verifica y vuelve a codificar la imagen; guarda el archivo en `uploads/covers` y el vinilo conserva una URL pública `/media/covers/:archivo`. La ruta de almacenamiento puede configurarse con `app.covers.directory`. Los archivos persisten al reiniciar y deben conservarse junto con la base de datos. Vite redirige `/media` al backend.

También se admiten enlaces directos a imágenes. El formulario informa si no cargan y espera a que termine la subida antes de guardar. Los archivos que antes se elegían como «Probar archivo local» no se habían enviado al servidor: para esos productos hay que editar el vinilo y volver a subir la portada.

El campo opcional «Canción o álbum en una plataforma» permite guardar enlaces de canciones y álbumes de Apple Music o Spotify y videos de YouTube. Se persiste como `albumUrl`; en el detalle se muestra el reproductor de la plataforma y un enlace para abrirla. Dejarlo vacío elimina el enlace y omitir el campo en PATCH lo conserva. La sección «Muestra de audio» admite esos mismos enlaces y archivos de audio directos de hasta 2048 caracteres, con duración opcional. Si hay una muestra seleccionada se reproduce esa; de lo contrario se utiliza el enlace de escucha.

El detalle de los vinilos habilitados, las reseñas públicas y las muestras son accesibles como invitado. Crear reseñas sigue requiriendo una compra pagada. Los reproductores usan las integraciones documentadas por [Spotify](https://developer.spotify.com/documentation/embeds/tutorials/creating-an-embed), [Apple Music](https://artists.apple.com/support/1117-apple-music-marketing-tools) y [YouTube](https://developers.google.com/youtube/player_parameters); la disponibilidad y la reproducción completa dependen de cada plataforma.

Las categorías estándar se completan al iniciar el backend sin reemplazar las existentes. El administrador puede crear otras desde «Nueva categoría». El selector de géneros permite elegir varios; se guardan en `vinyl_genre` y se conserva el género anterior de los vinilos existentes. Los filtros y la curaduría consideran también los géneros adicionales. Si falla la carga de las opciones, el formulario informa el error y permite reintentarlo.
