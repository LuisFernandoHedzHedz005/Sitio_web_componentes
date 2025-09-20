# Sitio Web Componentes

Este proyecto está desarrollado con [Next.js](https://nextjs.org).

## Instalación y ejecución

Clona el repositorio y ejecuta los siguientes comandos en la terminal:

```bash
cd Sitio_web_componentes
node start.mjs && npm i && npm run build && npm run start
```

Primero terndras que crear las variables de entorno en tu archivo .env correspondiente a tus credenciales, ademas se instalaran las dependencias, compilará el proyecto y lo iniciará en modo producción.

En caso de no querer hacerlo por este metodo, aquí hay un archivo .env de ejemplo

```bash
MONGODB_URI=mongodb+srv://myDatabaseUser:D1fficultP%40ssw0rd@cluster0.example.mongodb.net/?retryWrites=true&w=majority
DB_NAME=Mi_base_de_datos
JWT_SECRET=clavelarga
JWT_EXP=1d
```

## Acceso

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el sitio.

## Estructura principal

- El código fuente está en la carpeta `src`

## Requisitos

- Node.js y npm instalados en tu sistema.

---
Proyecto para la materia de Seguridad Informatica