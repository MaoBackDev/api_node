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

## JWT(json web token)
JWT no es un estándar de autenticación, sino que simplemente, es un estándar que nos permite hacer una comunicación entre dos partes de identidad de usuario. Con este proceso, además, podríamos implementar la autenticación de usuario de una manera que fuera relativamente segura.

### Configuración y generación de tokens
Para iniciar, se crea un directorio llmado utils: utils contendrá funciones que nos permitan gestionar nuestro sitio web. A continuación, creamos un archivo .js(El nombre que se desee), yo lo llamará tokenManager.js.  Seguiremos los siguientes pasos:
1. Importar el módulo jwt
    ``` import jwt from 'jsonwebtoken' ```
2. Creamos una función que nos permita gestionar nuestro token
    ```
        export const generateToken = (uid) => {

            // Tiempo de vids del token
            const expiresIn = 60 * 15

            try {
                // Construcción del token
                const token = jwt.sign({uid}, process.env.JWT_SECRET, {expiresIn})
                return {token, expiresIn}
            }catch(error){
                console.log(error)
            }
        }
    ```

La función recibe como parámetro el id del usuario, luego le asignamos un tiempo de vida al token en este caso durará 15 minutos.
Para construir el token, usamaos la función sign() del módulo jwt, la cual, recibe como parámetros el id como un objeto, también necesita un string secreto que configuramos en las variables de entorno(Puede ser cualquier string) y por último le pasamos la expiración también como objeto. estos pasos generan nuestro token, lo ultimo que hacemos es retornarlo como un objeto.

### ¿Cómo usar el método anterior?
Para la utilización de nuestra utilidad(Función), crearemos un middleware, este nos permitirá accederlo desde culaquier controlador que lo requiera. Ejecutaremos los siguientes pasos para la construcción del middleware:
1. Importar el módulo jwt
2. Crear la función(nombre deseado): la función recibe como parámetros el req, res, next  
    ``` export const tokenRequire = (req, res, next) => {} ```
3. Recuperamos la información enviada a trav´s del req: es importante aclarar que en este paso no accederemos al body, para este caso la información viajará a través del objeto headers, este a su vez contine un método llamdo authorization, el cual usa un tipo de convención llamado bearer token(Es el que se usa normalmente)
    ``` let token = req.headers.authorization;  ```
4. Verificamos que exista el token y como está usando bearer, debemos separar el token de la convención de bearer ya que esta  nos retorna una cadena con la palabra bearer, un espacio y el token. para ello usamos la función split()
    ``` token = token.split(' ')[1] ```
5. Usando la función verify() del módulo jwt validamos que el token sea valido:
    ``` const {uid} = jwt.verify(token, process.env.JWT_SECRET) ```

6. Si el paso anterior es válido, al re.uid le asignamos el uid del paso anterior y continuamos con la ejecución
    ``` 
        req.uid = uid
        next()
     ```
7. Por ultimo validamos los posibles errores y nuestra función se vería así:
    ```
        import jwt from 'jsonwebtoken'

        export const tokenRequired = (req, res, next) => {

            try {
                // Recuperamos el token enviado a través del request
                let token = req.headers.authorization; 

                // Validar que el token sea válido
                if(!token)
                    throw new Error('No bearer')
                
                // Separamos el formato bearer del token para no generar errores
                token = token.split(' ')[1]

                // Verificamos que el token exista en la base de datos. Nos retorna el payload que asignamos en la firma del token
                const {uid} = jwt.verify(token, process.env.JWT_SECRET)

                // Se envía el id del usuario al request para ser usado en cualquier controlador que use el middleware
                req.uid = uid
                next()
            }catch (error){
                console.log(error.message)

                // Verificación de errores
                const tokenVerificationErrors = {
                    "invalid signature": "La firma del JWT no es válida",
                    "jwt expired": "JWT expirado",
                    "invalid token": "Token no válido",
                    "No bearer": "Utiliza el formato bearer",
                    "jwt malformed": "JWT malformado"
                }

                return res.status(401).
                send({error: tokenVerificationErrors[error.message]})
            }
        }
    ```

### Uso del middleware en el controlador
Para usar las funciones anteriores, crearemos un controlador para gestionar el login de un usuario, donde primeramente recuperamos los valores enviados a través del body, generamos un aconsulta a la base de datos para verificar que la información sea verídica, si esto ocurre generamos el token. Así quedaría el controlador para el login:

```
    export const login = async (req, res) => {
    const { email, password } = req.body; // recuperar los datos enviados en el request

    try {
        let user = await User.findOne({ email }); // consultar si existe el email en la base de datos
        // Comparar las contraseñas. El método comparePassword es creado en el schema
        const passwordValidated = await user.comparePassword(password);

        if (!user || !passwordValidated)
        return res.status(400).json({ error: "Credenciales incorrectas" });

        // GENERAR JWT (json web token)
        const { token, expiresIn } = generateToken(user._id);

        return res.json({ token, expiresIn });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error del servidor" });
    }
    };
```

Ahora crearemos otro controlador que nos permita acceder a la información del usuario una vez este haya sido validado y se generará el token satisfactoriamente:
    ```
        // Funcción para acceder a la información del usuario loggeado
        export const infoUser = async (req, res) => {
        try {
            // Consulta  a la base de datos .lean() retorna el objeto con los datos específicos. Hace la consulta más rápida
            const user = await User.findById(req.uid).lean();
            return res.json({email: user.email});
        } catch (error) {
            return res.status(500).json({error: "Error del servidor"})
        }
        };
    ```


Ahora creamos las rutas de login y la ruta protegida donde usaremos los controladores creados en el paso anterior:

1. Ruta para el login: esta tiene validaciones y usa el middleware validationResultExpress
    ``` 
        router.post('/login',[
        body('email', "El formato no es correcto").trim().isEmail().normalizeEmail(),
        body('password', "La contraseña debe contener mínimo 8 caracteres").trim().isLength({min: 8}),
        ], 
        validationResultExpress,
        login
        )
    ```
2. Ruta protegida: Usa el middleware tokenRequired y el controlador infoUser
    ``` router.get('/protected', tokenRequired, infoUser) ```


## Persistencia del token
En pasos anteriores hemos creado un token, el cual podiamos usar para acceder a una ruta protegida y que nos retornara el email del usuario que realizaba el login. No obstante, necesitamos mantener el token activo para poder usarlo durante la sesión del usuario logeado. Para asegurar la persistencia del token, se suele usar el localStorage y las cookies, teniendo estos dos métodos cierta vulnerabilidad a clientes maliciosos. Para nuestra api usaremos un refresh token; este vivirá en el navegador pero el token original del usuario permancerá en la memoria de nuestro equipo, esta forma garantiza que practicamente sea invulnerable a los ataques. Para generar esta funcionalidad seguiremos los siguientes pasos:
1. Iremos hasta la carpeta utils y en el archivo tokenManager crearemos una nueva función:

    ```
        // Generar el refresh token
        export const refreshTokenGenerator = (uid, res) => {

            const expiresIn = 60 * 60 * 24 * 30 // tiempo de expiración de 30 días

            try {  
                // Firma del token usando la variable de ambiente JWT_REFRESH
                const refreshToken = jwt.sign({uid}, process.env.JWT_REFRESH, {expiresIn})

                // Guardar el refresh token en una cookie
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: !(process.env.MODE === 'developer'),  // Retorna false
                    expires: new Date(Date.now() + expiresIn * 1000)  // Se necesita para la expiración del refresh token
                })

            } catch (error) {
                console.log(error)
            }
        }
    ```

En esta función lo que haremos será firmar un nuevo token, con la diferencia que usaremos una nueva variable de entorno para el refreshToken yo la llamaré JWT_REFRESH y puede tener cualquier string como valor. La varibale espiresIn tendrá un tiempo de expiración de 30 días(pudes poner el tiempo que desees). por último almacenaremos el token en una cookie.

2. El siguiente paso será ir a nuestro controller y creamos un nuevo controlador que se encargará de gestionar el refreshToken y enviarlo a una nueva ruta que crearemos en el siguiente paso. Es necesario importar el módulo jwt en el controlador. Así quedará nuestro controlador:

```
import jwt from 'jsonwebtoken'
// Controlador para el refresh token
export const refreshToken = (req, res) => {

  try { 
    // Recuperamos el refresh token de las cookies. Almacenado en el archivo tokenManager
    const refreshTokenCookie = req.cookies.refreshToken

    if(!refreshTokenCookie) throw new Error("No Existe el Token")  // Validar la existencia del token

    // Se verifica el token usando jwt y almacenamos el payload(uid) en una constante
    const {uid} = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH)

    // Generamos un token(válido) y le pasamos el uid extraido en el paso anterior
    const { token, expiresIn } = generateToken(uid);

    return res.json({token, expiresIn})

  } catch (error) {
    console.log(error)
    // Verificación de errores
    const tokenVerificationErrors = {
      "invalid signature": "La firma del JWT no es válida",
      "jwt expired": "JWT expirado",
      "invalid token": "Token no válido",
      "No bearer": "Utiliza el formato bearer",
      "jwt malformed": "JWT malformado"
  }

  return res.status(401).send({error: tokenVerificationErrors[error.message]})
  }

}
```

3. Por último crearemos una nueva ruta protegida que se encargará de refrescar el token cada que este cumpla su ciclo de vida. Debemos importar la función refreshToken que creamos en el controlador en el paso anterior

``` 
    import { infoUser, login, refreshToken, register } from '../controllers/auth.controller.js';
    // Ruta para el refresh token
    router.get('/refresh', refreshToken) 
```