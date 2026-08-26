# FreshBox

Aplicacion movil hibrida para registrar productos de la despensa, consultar sus fechas de vencimiento y recibir alertas de consumo.

## Prototipo

[Ver prototipo de FreshBox en Figma](https://www.figma.com/make/VfVfUB446TrUmehxMBMtU3/FreshBox-Mobile-App-Wireframe?t=wlTEyC5o2WmSpMg4-1)

## Tecnologias

- React 19
- Vite 8 como bundler
- Tailwind CSS 4 para utilidades de interfaz
- Sass para estilos reutilizables y clases parciales
- Zustand para la sesion y las cuentas de usuario
- Lucide React para iconos

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

`npm install` debe ejecutarse tambien despues de cada `git pull` que cambie `package.json` o `package-lock.json`. Esto mantiene `node_modules` sincronizado y evita errores como `zustand could not be resolved`.

Vite mostrara la URL local en la terminal. Si el puerto `5173` ya esta ocupado, Vite elegira automaticamente otro, por ejemplo `http://localhost:5174/`; se debe abrir exactamente la URL que aparezca en la terminal. Para revisar la aplicacion en modo produccion:

```bash
npm run build
npm run preview
```

### Solucion de problemas

Si aparece un error de dependencia faltante despues de actualizar el repositorio, detener el servidor, ejecutar `npm install` y volver a iniciar con `npm run dev`:

```bash
npm install
npm run dev
```

Si el problema continua, borrar la instalacion local y reconstruirla. En PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

No es necesario instalar Zustand, Sass ni otras dependencias manualmente: todas estan declaradas en `package.json` y fijadas en `package-lock.json`.

## Scripts

- `npm run dev`: inicia el servidor de desarrollo con recarga automatica.
- `npm run build`: genera el bundle optimizado en `dist/`.
- `npm run preview`: sirve localmente el bundle de produccion.
- `npm run lint`: ejecuta Oxlint.

## Sass

La entrada Sass se encuentra en `src/styles/main.scss` y carga dos parciales mediante `@use`:

- `src/styles/_layout.scss`: variable `$safe-area-bottom`, mixin `viewport-layer` y las clases `.app-shell` y `.app-device-screen`, usadas por el marco principal de la aplicacion para controlar el area segura del dispositivo.
- `src/styles/_fonts.scss`: declaraciones `@font-face` de las tipografias empaquetadas.

Vite compila y minifica automaticamente los archivos Sass y JavaScript al ejecutar `npm run build`. El compilador Sass (`sass-embedded`, requerido por Vite 8) esta incluido como dependencia de desarrollo en `package.json`.

## Inicio de sesion

El registro y el inicio de sesion se resuelven en el dispositivo, sin servidor, mediante un store de Zustand con el middleware `persist` (`src/store/authStore.js`). Las cuentas quedan en `localStorage` bajo la clave `freshbox_auth`.

La contraseña nunca se guarda en texto plano. Al registrarse se genera una sal aleatoria por cuenta y se almacena la derivacion PBKDF2-SHA256 con 150000 iteraciones (`src/utils/password.js`), usando la API Web Crypto del navegador: no requiere librerias externas ni conexion. Al iniciar sesion se vuelve a derivar la contraseña recibida y se compara en tiempo constante contra el valor guardado.

El store separa los datos en dos bloques: `accounts` guarda el perfil visible (nombre, correo, telefono, plan) y `credentials` guarda la sal y el hash. Gracias a esa separacion, el objeto de usuario que reciben las pantallas no contiene ningun dato sensible.

Para probar la aplicacion hay que crear una cuenta desde la pestaña **Crear cuenta**; despues se puede iniciar sesion con ese correo y contraseña. El correo no distingue mayusculas.

Cada cuenta tiene su propia despensa: los productos se guardan como `{ idDeUsuario: productos[] }`, de modo que una cuenta recien registrada empieza vacia y ninguna cuenta ve los productos de otra. La aplicacion no trae productos de ejemplo.

## Funcionamiento sin internet

La aplicacion no consume APIs externas durante la ejecucion: los datos iniciales, iconos, imagenes y tipografias se incluyen en el bundle.

Las fuentes Inter y Fraunces se sirven desde `src/assets/fonts/` y se declaran en el parcial `src/styles/_fonts.scss`, por lo que no se depende de Google Fonts ni de ninguna conexion de red. Son ficheros variables (`woff2-variations`): un solo archivo por subconjunto cubre los pesos 100 a 900 y conserva los ejes `opsz`, `SOFT` y `WONK` que usa la clase `.font-display`. Ambas estan bajo licencia SIL Open Font License 1.1.

Verificado sobre el bundle de produccion (`npm run build && npm run preview`): el navegador solo realiza peticiones a `localhost`, ninguna a dominios externos.

## Estructura principal

- `src/screens/`: pantallas de inicio, busqueda, categorias, alertas, configuracion y perfil.
- `src/components/`: componentes reutilizables de la interfaz.
- `src/context/`: estado global de la despensa y preferencias.
- `src/store/`: store de Zustand con la sesion y las cuentas.
- `src/data/`: categorias y datos iniciales.
- `src/utils/`: fechas, traducciones, cantidades y estadisticas.
- `src/styles/`: entrada Sass y clases parciales.

## Estado de publicacion

El proyecto web esta preparado para generar el bundle con Vite. La integracion con Capacitor, Android Studio, firma y publicacion en Google Play debe configurarse antes de crear el instalador Android.
