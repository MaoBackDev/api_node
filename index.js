import 'dotenv/config' // enviroment variables
import './database/connectdb.js' // Database conectction module
import cookieParser from 'cookie-parser';  // cookies
import express from 'express'  // Import express
import cors from 'cors'

import authRouter from './routes/auth.route.js';
import linkRouter from './routes/link.router.js'
import redirectRouter from './routes/redirect.route.js'

const PORT = process.env.PORT || 5000  
const app = express()           // object express

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2]

app.use(cors({
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            return callback(null, origin)
        }
        return callback('Error de CORS origin: ' + origin + ' no autorizado!')
    }
}))
app.use(express.json())  // Permite leer las solicitidues en json
app.use(cookieParser())  // Permite usar cookie-parser


// Ejemplo back redirect (opcional)
app.use('/', redirectRouter)


// Routs
app.use('/api/v1/user', authRouter)
app.use('/api/v1/links', linkRouter)

// Archivos estaticos: ejemplo login jwt
// app.use(express.static('public'))


// Listen method to server connection
app.listen(PORT, () => {
    console.log("✔✔✔ https://localhost: " + PORT)
})