# FreshBox

Aplicacion movil hibrida para registrar productos de la despensa, consultar sus fechas de vencimiento y recibir alertas de consumo.

## Prototipo

[Ver prototipo de FreshBox en Figma](https://www.figma.com/make/VfVfUB446TrUmehxMBMtU3/FreshBox-Mobile-App-Wireframe?t=wlTEyC5o2WmSpMg4-1)

## Tecnologias

- React 19
- Vite 8 como bundler
- Tailwind CSS 4 para utilidades de interfaz
- Sass para estilos reutilizables y clases parciales
- Lucide React para iconos

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

Vite mostrara la URL local en la terminal. Para revisar la aplicacion en modo produccion:

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev`: inicia el servidor de desarrollo con recarga automatica.
- `npm run build`: genera el bundle optimizado en `dist/`.
- `npm run preview`: sirve localmente el bundle de produccion.
- `npm run lint`: ejecuta Oxlint.

## Sass

La entrada Sass se encuentra en `src/styles/main.scss` y carga el parcial `src/styles/_layout.scss` mediante `@use`. El parcial contiene el mixin y las clases `.app-shell` y `.app-device-screen`, usadas por el marco principal de la aplicacion para controlar el area segura del dispositivo.

Vite compila y minifica automaticamente los archivos Sass y JavaScript al ejecutar `npm run build`. El compilador Sass esta incluido como dependencia de desarrollo en `package.json`.

## Funcionamiento sin internet

La aplicacion no consume APIs externas durante la ejecucion: los datos iniciales, iconos e imagenes se incluyen en el bundle. Las tipografias usan las familias locales definidas como fallback, por lo que no depende de Google Fonts ni de una conexion de red.

## Estructura principal

- `src/screens/`: pantallas de inicio, busqueda, categorias, alertas, configuracion y perfil.
- `src/components/`: componentes reutilizables de la interfaz.
- `src/context/`: estado global de la despensa y preferencias.
- `src/data/`: categorias y datos iniciales.
- `src/utils/`: fechas, traducciones, cantidades y estadisticas.
- `src/styles/`: entrada Sass y clases parciales.

## Estado de publicacion

El proyecto web esta preparado para generar el bundle con Vite. La integracion con Capacitor, Android Studio, firma y publicacion en Google Play debe configurarse antes de crear el instalador Android.
