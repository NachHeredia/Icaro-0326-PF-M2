# Ninalu

Proyecto final del Módulo 2 de JavaScript de la Diplomatura en Desarrollo Web FullStack.

Realicé un e-commerce bpasico desarrollado con HTML, CSS y JavaSrcript Vanilla (ES Modules), sin frameworks ni builds tools. Todo el comportamiento dinámico del sitio (el carrito de compras, los filtros dentro de la sección de categorías, la barra de búsqueda y el menú desplegable) está resuelto con JavaScript nativo del navegador.

## Índice
- Stack Técnico
- Arquitectura realizada en JavaScript
- Módulos
- Eventos del carrito de compras
- Atributos 'data-*'

---

## Stack Técnico
| Tecnología | Uso |
| --- | --- |
| HTML | Estructura semántica de páginas |
| CSS3 | Estilos y variables, en esta versión no se generó la opcion mobile/responsive para priorizar la interactividad de las funciones |
| JavaScript ES Modules ('type = "module"') | Toda la lógica interactiva, sin frameworks ni bundler |

Todos los módulos JS se cargan directamente por el navegador vía `<script type = "module">`, por lo que **todos los imports entre archivos deben incluir la extensión `.js`** 

---

## Arquitectura realizada en JavaScript

El proyecto sigue un patrón simple de **módulos de responsabilidad**, orquestadps desde un único punto de entrada.


### `app.js` - el orquestador

Cada página HTML un único script inline que importa y ejecuta `initApp ()`:

```js
import { FilterUi } from "./CategoryFilterUi.js";
import { initProductsUi } from "./ProductsUi.js";
import { initCartBadgeUi } from "./CartBadgeUi.js";
import { initCartDrawerUi } from "./CartDrawerUi.js";
import { initSearchUi } from "./SearchUi.js";
import { initNavDropdownUi } from "./NavDropdownUi.js";
 
export function initApp() {
  initCartBadgeUi();
  initCartDrawerUi();
  initSearchUi();
  initNavDropdownUi();
 
  if (document.querySelector(".product-card")) {
    initProductsUi();
  }
 
  if (document.querySelector(".category-section")) {
    new FilterUi();
  }
}
```

`initApp()` corre en **todas** las páginas del sitio, pero algunos módulos se inicializan condicionalmente (`ProductsUi.js` y `FilterUi.js`) según qué elementos existan en el DOM de esa página en particular - así, por ejemplo, `FilterUi` no hace nada en el home, que no tiene `.category-section`. 

---

## Módulos

### `Cart.js` - modelos de datos
Class `CartItem`: representa un ítem dentro del carrito. Expone dos getters calculados:
- `key` → identificador único combinando producto + variante (`productId::variant`), usado para diferenciar, por ej, "Detergente 1/2LT" de "Detergente 5LT" como líneas distintas del carrito.
- `lineTotal` → precio unitario * cantidad

### `CartManager.js` — estado del carrito

Class `CartManager`: instancia una única vez como singleton (`export const cartManager = new CartManager()`) e importada por todos los módulos que necesitan leer o modificar el carrito. Mantiene el array de `CartItem` y expone la API pública:

| Método | Qué hace |
| --- | --- |
| `addItem(productData, quantity)` | **Agrega** un producto nuevo o suma cantidad si ya existe (mismo `key`) |
| `removeItem(itemKey)` | Elimina un ítem |
| `incrementQty(itemKey)` / `decrementQty(itemKey)` | Incrementa y decrementa (suma/resta) unidades y elimina el ítem si llega a 0 | 
| `clear()` | Vacía el carrito | 
| `getItems()` / `getItemCount()` / `getSubtotal()` / `getDiscount()` / `getTotal()` | Lecturas derivadas del estado | 
| `hasOfferItems()` | Lee si hay algún ítem marcado como oferta | 

Cada operación que modifica el estado dispara `_notifyChange()`, que emite el evento custom `cart:updated`. Es el mecanismo central que mantiene sincronizada toda la UI del carrito sin acoplar `CartManager` a ningún elemento del DOM.

### `ProductsUi.js` — interacción de las cards de producto
Por cada `.product-card` en la página: 
- Engancha los clics de `.qty-pill` (selector de variante/cantidad) para actualizar el precio mostrado en la card, que es acorde a la cantidad del producto y marca la pill de esa cantidad como activa con el hover aplicado.
- Construye dinámicamente un stepper (`+`/`-`) que reemplaza el botón "Agregar al carrito" una vez que el producto ya está en el carrito.
- Al agregar, arma el objeto de datos del producto leyendo los atributos `data-*` de la card y llama a `cartManager.addItem(...)`.
- Escucha el `cart:updated`  para sincronizar el stepper de cada card con la cantidad real que tiene ese producto en el carrito (por si se modifica desde el drawer).

### `CartBadgeUi.js` — contador en la nav bar
Actualiza el número dentro de `#cart-badge` y controla su visibilidad (`display: none` cuando el carrito está vacío). Se suscribe a `cart:updated` para mantenerse siempre sincronizado con el estado real del carrito, sin importar desde qué componente se haya modicado (una card, el drawer, etc.).

### `CartDrawerUi.js` — panel lateral del carrito
 
Es el módulo más grande. Responsabilidades:
- Inyecta el markup del drawer (`.cart-drawer`) y el overlay en el `<body>` la primera vez que se ejecuta — no vive en el HTML estático de cada página, se genera por JS.
- Renderiza la lista de ítems, subtotal, descuento y total en cada `cart:updated`.
- Maneja apertura/cierre (click en el botón "Carrito", en el overlay, en la "×", etc).
- Delega los clicks de incrementar/decrementar cantidad dentro del drawer a `cartManager`.
### `CategoryFilterUi.js` — filtro de categorías
 
Clase `FilterUi`. Lee el hash de la URL (`#limpieza`, `#animales`, etc.) al cargar la página de catálogo y muestra solo la sección (`.category-section[data-category]`) correspondiente, marcando la pill activa con la clase `is-selected`. Escucha tanto los clicks en las pills como el evento `hashchange`, así que también responde si el usuario navega con los botones atrás/adelante del navegador.
 
### `NavDropdownUi.js` — menú "Categorías"
 
Controla la apertura/cierre del menú desplegable de la nav bar por click (además del `:hover` que ya cubre el CSS). Cierra el menú al hacer click afuera, al presionar `Escape`, o al seleccionar una categoría.
 
### `SearchUi.js` — búsqueda de productos
 
Tiene dos modos, elegidos automáticamente según la página:
- **Filtro inline** (en `categoriesSection.html`, donde ya hay `.product-card` en el DOM): oculta/muestra cards y secciones según coincida el texto tipeado con `data-name`.
- **Dropdown de resultados** (en páginas sin catálogo cargado, como el Home): hace `fetch` a `categoriesSection.html`, parsea su HTML con `DOMParser` para armar un índice de productos en memoria, y renderiza un dropdown con foto + nombre + precio por cada coincidencia, linkeando a la categoría correspondiente.
En ambos modos, la comparación de texto usa una función `normalize()` que pasa a minúsculas y remueve tildes, para que la búsqueda no distinga mayúsculas/acentos.


## Eventos

Todo el carrito se sincroniza mediante un **evento custom del DOM**, `cart:updated`, en vez de que los módulos se llamen entre sí directamente. Esto desacopla `CartManager` (que no tiene relación con la UI) de los 3 módulos que sí la renderizan:

```js
document.dispatchEvent(
  new CustomEvent("cart:updated", {
    detail: { items, itemCount, subtotal, discount, total },
  })
);
```
 
`CartBadgeUi.js`, `CartDrawerUi.js` y `ProductsUi.js` escuchan este evento de forma independiente. Cualquier acción que modifique el carrito - agregar desde una card, cambiar de cantidad desde el drawer, etc. - dispara el mismo evento y actualiza automáticamente los 3 puntos de la UI sin que ninguno necesite saber quién disparó el cambio.

---

## Atributo 'data-*'

`ProductsUi.js` depende de que el HTML tenga estos atributos para poder leer los precios y cantidades:
 
**Card con variantes (pills de cantidad):**
```html
<article class="product-card" data-product-id="..." data-name="..." data-category="..." data-offer="false">
  ...
  <button class="qty-pill is-selected" data-variant="1/2 LT" data-price="1200">1/2 LT</button>
  <button class="qty-pill" data-variant="5 LT" data-price="10000">5 LT</button>
  ...
</article>
```
 
**Card sin variantes (con precio único):**
```html
<article class="product-card" data-product-id="..." data-name="..." data-category="..." data-offer="false" data-variant="Único">
  ...
  <p class="price-value" data-price="1100">$1.100</p>
  ...
</article>
```
 
`data-price` siempre en formato numérico simple (`1200`, no `$1.200` ni `1.200`)

---

## 5.  High Quality Wireframe UI

![Imagen](https://www.figma.com/design/0eaPoJCKfpuY7r8nZGYSZM/PILAZE?node-id=2088-224&t=bx1GkUfNJ4wsqZAT-4)