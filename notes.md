# CREACIÓN DE UNA API REST CON NODE JS, EXPRESS Y MONGODB

## Configuración

* Instalar node.js
* Crear tu proyecto y ejecutarlo en el editor de preferencia.
* Ejecutar comando npm init -y: Esto creará un nuevo archivo llamado package.json.

## Instalación de dependencias
Node es un administrador de paquetes que nos permite instalar dependencias en nuestro proyecto. Para instalar un paqute lo podemos hacer de forma local o global y se usa el comando npm i dependencia para hacerlo de forma local y npm i -g dependencia para instalación global.
Para este proyecto usaremos las siguientes dependencias:
* express -->  npm i express: Levantar servidor de desarrollo
* nodemon --> npm i -D nodemon: ejecutar los cambios en el servidor de manera automática
* express-validator --> npm i express-validator: Valida las peticiones http
* mongoose --> npm i mongoose: ODM para generar consultas a la base de datos
* jsonwebtoken --> npm i jsonwebtoken: enviar tokens de seguridad desde el front
* dotenv --> npm i dotenv: administrar variables de entorno
* cors --> npm i cors: comunica los servidores back y front
* cookie-parser --> npm i cookie-parser: guardar tokens en memoria
* bcryptjs --> npm i bcryptjs: Encriptar contraseñas

## Estructura del proyecto
index.js
.env
.gitignore
README.md
└── controllers
└── database
└── helpers
└── middlewares
└── models
└── routes