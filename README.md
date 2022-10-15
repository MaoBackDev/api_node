# CREACIÓN DE UNA API REST CON NODE JS, EXPRESS Y MONGODB

## Configuración

* Instalar node.js
* Crear tu proyecto y ejecutarlo en el editor de preferencia.
* Ejecutar comando npm init -y: Esto creará un nuevo archivo llamado package.json.

## Instalación de dependencias
Node es un administrador de paquetes que nos permite instalar dependencias en nuestro proyecto. Para instalar un paqute lo podemos hacer de forma local o global y se usa el comando npm i dependencia para hacerlo de forma local y npm i -g dependencia para instalación global.
Para este proyecto usaremos las siguientes dependencias:
* express: Levantar servidor de desarrollo
``` npm i express ```
* nodemon: ejecutar los cambios en el servidor de manera automática
` npm i -D nodemon `
* express-validator: Realizar validaciones
` npm i express-validator `
* mongoose: ODM para generar consultas a la base de datos
` npm i mongoose `
* jsonwebtoken: permite generar tokens para sesiones
` npm i jsonwebtoken `
* dotenv: administrar variables de entorno
` npm i dotenv `
* cors: comunica los servidores back y front
` npm i cors `
* cookie-parser: guardar tokens en memoria
` npm i cookie-parser `
* bcryptjs: Encriptar contraseñas
`npm i bcryptjs`

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


## Schemas
Los esquemas nos permitiran dar una estructura para cada registro en la base de datos. Los esquemas los usamos a través de la dependencia de mongoose. Debemos importar el modulo y usar la clase Schema y el método model:
1. Importación del módulo y creación de las constantes. Para la creación de las constantes usamos la destructuración de objetos: 
    ```import mongoose from 'mongoose'```
    ```const {Schema, model} = mongoose```
2. Creamos nuestro eschema como un objeto de la clase Schema:
    ```
        const userSchema = new Schema({
            email: {
                type: String,
                required: true,
                trim: true,
                unique: true,
                lowercase: true,
                index: { unique: true },
            },
            password: {
                type: String,
                required: true,
            },
        })
    ```
    Este, será el schema de nuestra base de datos, el cual recibe en su constructor un objeto con los campos que tendrá nuestro registro, a su vez, los campos contiene atributos que podemos agregar como campos de validación.
3. Exportamos nuestro esquema usando el método model, este recibe como parámetros un nombre --> string y el esquema que creamos
    ```const User = model('user', userSchema)```

## Routes
Las rutas nos permiten establecer la dirección de nuestra slocitud, ya bien sea GET, POST, PUT etc. Para la configuración de nuestras rutas usaremos el paquete de exprees:
* Importación del modulo
``` import express from 'express'; ```
* crearemos un objeto que nos permitira usar la clase Router de express.
``` const router = express.Router(); ```
* Creemos nuestra primera ruta
```  
    router.post('/register', (req, res) => {
        res.json({ok: 'Register Succesfully'})
    })
```
Tenemos una ruta sencilla, la cual al comprobar la solicitud nos retorna un objeto json. Es importante que siempre usaremos json para las solicitudes.

Ya configurada nuestra primera ruta debemos exportar la ruta la exportaremos por default para poder llamarla con un nombre específico
``` export default router ```
Bien, ahora debemos indicarle a nuestro archivo index que va a utilizar el router que acabamos de configurar. Para ello, en el archivo index importamos nuestro archivo de rutas
``` import authRouter from './routes/auth.route.js' ```
Como se puede notar, no estamos importando el nombre router, sino que, ahora lo llamamos authRouter ya que archivo contendrá las rutas de nuestro sistema de autenticación. Por último le decimos al programa que usa la constante que acaabamos de crear y la cual contiene las rutas de nuestro sistema de autenticación
``` app.use('/', authRouter) ```
Ya podemos usar nuestras rutas. Sin embargo, como estamos realizando una api, por convención es importante darle el nombre a las rutas especificando que es una api y la versión que estamos desarrollando. Nuestro código quedaría así:
``` app.use('/api/v1/', authRouter) ```

De momento todo funciona con normalidad pero, es importante que la lógica que ejecutemos no se encuentfe en las rutas sino en el controlador. para ello en la carpeta controllers crearemos un nuevo archivo auth.controllers.js

Crearemos una constante que se encargará de contener la lógica de nuestra solicitud
```
    export const register = (req, res) => {
        res.json({ok: 'Register Succesfully'})
    }
```
Ahora la respuesta está en el controlador, asi que, necesitamo decirle a nuestra ruta que use el controlador para procesar la información. Debemos importar el controlador en nuestro archivo de rutas:
``` import { register } from '../controllers/auth.controller.js'; ```

Ahora la ruta se verá así:
``` router.post('/register', register) ```

## Validaciones con express-validator
Las validaciones siempre deben tener una prioridad en nuestras aplicaciones, para crear validaciones, usaremos el paquete de express-validator, el cual, nos provee una serie de métodos pre-establecidos que nos solventará de una manera sencilla esta importante tarea.

1. Lo primero que haremos será crear un nuevo archivo en la carpeta middlewares para este ejemplo lo llamaré validationResultExpress puede ser el nombre que se desee. paso seguido exportaremos el módulo de express-validator
    ``` import { validationResult } from "express-validator" ```
2. Creamos el método que nos permita realizar las validaciones
    ``` export const validationResultExpress = (req, res, next) =>{

            // Capturamos los posibles errores
            const errors = validationResult(req);

            // Validamos que los errores existan y enviamos una respuesta con dichos errores en formato json
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()})
            }

            // Si no existen errores continuamos con la ejecución del programa
            next()
        }
    ```
    El método recibe 3 parámetros req, res, next. El req: contiene la información que se envía a través de la petición. El res: Se encarga´ra de enviar la respuesta si se generan errores y el next: permite continuar con la ejecución si no se presentan errores.

    Ahora necesitamos crear las validaciones y que se ejecuten, estás deben ir en el archivo de rutas. Lo primero que hacemos es importarel módulo 
    ``` import { validationResultExpress } from '../middlewares/validationResultExpress.js'; ```
    Ahora en nuestra ruta agregaremos un array con las validaciones que queremos agregar para nuestros campos. Para ello usarems el método body(campo, msg_error).validacion() que nos provee express-validator.
    ``` body('email', "El formato no es correcto").trim().isEmail().normalizeEmail(), ```
    En la línea anterior estamos validando el campo email y le enviamos un mensaje de error si no pasa la validación. En este caso validamos trim(): quita los espacios al inicio y final, isEmail(): se encarga de validar que el el email sea valido y normalizeEmail(): Evita la inserción de texto no deseado por usuario maliciosos.  Ahora nuestra ruta tendrá la siguiente estructura: 
    ```
        router.post('/register',
            [
                body('email', "El formato no es correcto").trim().isEmail().normalizeEmail(),
                body('password', "La contraseña debe contener mínimo 8 caracteres").trim().isLength({min: 8}),

                // custom permite crear validaciones personalizadas que no  contiene el paquete de validator, en este caso validamos que la segunda contraseña se igual a l primera.
                
                body('password', "El formato no es correcto")
                .custom((value, {req}) => {
                    if (value !== req.body.repassword){
                        throw new Error('Las contraseñas no coinciden')
                    }
                    return value
                })
            ], 
            validationResultExpress,
            register
        )
    ```


