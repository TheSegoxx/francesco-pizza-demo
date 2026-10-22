# Francesco Pizza Napoletana · Sitio web

Landing page de **Francesco Pizza Napoletana** (Dean Funes 37, Formosa). Tiene el menú completo, el pedido por WhatsApp, las reservas por Meitre y el Instagram.

Diseño y desarrollo: **Leandro Segovia** · © Francesco Pizza Napoletana

## Estructura

```
francesco-pizza/
├── index.html            ← estructura de la página
├── css/
│   └── style.css         ← colores, tipografías, diseño y animaciones (CSS)
├── js/
│   ├── datos.js          ← MENÚ, PRECIOS, HORARIOS y número de WhatsApp (lo que más se edita)
│   ├── app.js            ← arma el menú, el pedido por WhatsApp y los horarios
│   └── animaciones.js    ← ruleta, ficha del plato, efectos, cuenta regresiva, etc.
├── assets/
│   ├── img/
│   │   ├── hero.jpg      ← foto grande de la portada
│   │   ├── marca/        ← logo de Francesco (PNG transparente)
│   │   ├── ruleta/       ← fotos cuadradas chicas de las 14 pizzas para la ruleta
│   │   └── platos/       ← una foto por plato (nombre = id del plato en datos.js)
│   └── icons/
│       └── favicon.png, apple-touch-icon.png  ← ícono de la pestaña (la F. del logo)
└── README.md
```

## Cómo hacer cambios

- **Precios o platos:** abrí `js/datos.js` y cambiá `price:` (sin puntos: `24000`). Se actualizan solos el menú, la ruleta y el pedido.
- **Fotos:** reemplazá el archivo en `assets/img/platos/` y mantené el mismo nombre (por ejemplo `diavola.jpg`). Lo ideal es un formato horizontal 4:3 de unos 960 × 720 px.
- **Horarios:** también están en `js/datos.js` (`SCHED`), en minutos: 20:00 = 1200 y 00:00 = 1440.
- **WhatsApp:** está en `WA_NUMBER`, dentro de `js/datos.js`.
- **Links de Reservas e Instagram:** se cambian en `index.html` (buscá `meitre.com` o `instagram.com`).

## Publicarlo

Subí la carpeta completa a cualquier hosting estático: Netlify (arrastrar y soltar), Vercel, GitHub Pages, Hostinger, etc. No necesita servidor ni base de datos.

## Animaciones y accesibilidad

Si el equipo del visitante tiene activado "reducir movimiento" (en Windows: *Configuración → Accesibilidad → Efectos visuales → Efectos de animación*), se frenan solo las animaciones de fondo: la pizza girando, el mantel y el pulso. La ruleta, la ficha del plato, el efecto al agregar y las apariciones siguen funcionando.

## Fotos

Las fotos son ilustrativas y vienen de Wikimedia Commons, con licencias libres (CC0, CC BY y CC BY-SA). Los créditos aparecen al pie de la página, en "Fotos ilustrativas · créditos". Si se reemplazan por fotos propias, se puede borrar esa entrada de `CREDITS` en `js/datos.js`.
