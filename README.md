# Ninalu — Estructura de contenido

## 1. Datos generales del sitio
| Campo | Valor |
|---|---|
| Nombre del local | Ninalu |
| Paleta de colores | Celeste y Lila |
| Stack técnico | HTML, CSS, Bootstrap, JavaScript |

## 2. Categorías (para el menú de navegación)
1. Productos de limpieza
2. Alimentos y productos para animales
3. Higiene y cuidado personal
4. Aromatizantes
5. Accesorios y productos complementarios
6. Ofertas semanales *(sección destacada, no es una categoría de rubro sino una vidriera de promos)*

---

## 3. Catálogo de productos

### 3.1 Productos de limpieza
| Producto | Descripción | Presentación | Precio |
|---|---|---|---|
| Detergente Manos Suaves | Para lavar vajillas | 1/2 LT | $1.200 |
| | | 5 LT | $10.000 |
| Jabón líquido tipo Skip | Para lavar ropa | 1,5 LT | $2.200 |
| | | 2 LT | $2.800 |
| Suavizante para ropa | Agradable fragancia | 1 LT | $1.000 |
| | | 2 LT | $1.800 |
| Lavandina | Desinfecta y limpia superficies del hogar | 1 LT | $800 |
| Perfuminas para piso | Diferentes aromas | 1 LT | $700 |
| | | 1,5 LT | $1.000 |

### 3.2 Alimentos y productos para animales
| Producto | Descripción | Presentación | Precio |
|---|---|---|---|
| Alimento para perros Nutribon | Raza pequeña | 1 kg | $2.600 |
| Alimento para gatos Gati | — | 1 kg | $4.000 |
| Alimento para conejos | Alimentación diaria | 1 kg | $1.500 |
| Alimento para pájaros | Mezcla de semillas | 1 kg | $2.000 |
| Alimento para gallinas | Mezcla de semillas | 1 kg | $1.100 |

### 3.3 Higiene y cuidado personal
| Producto | Descripción | Presentación | Precio |
|---|---|---|---|
| Shampoo Algabo | Repuesto | 300 ml | $2.000 |
| Rollo de cocina Cartabella | — | Pack x3 | $2.100 |
| Tinturas EstereoColor | Variedad de colores | Unidad | $3.500 |
| Gel para pelo Gomina | — | 150 gr | $3.000 |
| Toallitas femeninas Doncella | — | Paquete | $1.600 |

### 3.4 Aromatizantes
| Producto | Descripción | Presentación | Precio |
|---|---|---|---|
| Aromatizador textil Saphirus | — | 250 ml | $4.300 |
| Sahumerios artesanales | — | Pack x10 | $1.300 |
| Difusor aromático Saphirus | — | Unidad | $6.500 |
| Velas blancas para hornitos | — | 1 unidad | $400 |
| Aerosol aromatizante Saphirus | — | 185 gr | $6.600 |

### 3.5 Accesorios y productos complementarios
| Producto | Descripción | Presentación | Precio |
|---|---|---|---|
| Gomitas para cabello | Color negro liso | 1 unidad | $1.000 |
| Lima de uñas | — | 1 unidad | $1.500 |
| Bálsamo labial | — | 1 unidad | $4.000 |
| Bolsas de consorcio | 60x90 | Pack x10 | $2.000 |
| Bolsas de residuo | 45x60 | Pack x30 | $2.000 |

### 3.6 Ofertas semanales
| Producto | Descripción | Presentación | Precio |
|---|---|---|---|
| Jabón líquido marca económica (tipo Skip/Ariel) | Para lavar ropa | 1 LT | $1.100 |
| | | 3 LT | $3.000 |
| Detergente Ecoblend | Para lavar vajillas | 1/2 LT | $600 |
| Billeteras artesanales | — | 1 unidad | $4.000 |

---

## 4. Notas del desarrollo
- Cada producto se modelará como un objeto JS con: `id`, `nombre`, `descripcion`, `categoria`, `presentaciones: [{ medida, precio }]`, `imagen`.
- Para los productos con más de una presentación (ej. Detergente Manos Suaves) se creará un array de opciones en vez de un precio único.


---

## 5.  High Quality Wireframe UI

![Imagen](https://www.figma.com/design/0eaPoJCKfpuY7r8nZGYSZM/PILAZE?node-id=2088-224&t=bx1GkUfNJ4wsqZAT-4)