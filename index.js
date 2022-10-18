import cookieParser from 'cookie-parser';
import 'dotenv/config' // enviroment variables
import './database/connectdb.js' // Database conectction module
import authRouter from './routes/auth.route.js';
import express from 'express'  // Import express

const PORT = process.env.PORT || 5000  
const app = express()           // object express
app.use(express.json())  // Permite leer las solicitidues en json
app.use(cookieParser())  // Permite usar cookie-parser

// Routs
app.use('/api/v1/user', authRouter)

// Archivos estaticos: ejemplo login jwt
app.use(express.static('public'))



// Listen method to server connection
app.listen(PORT, () => {
    console.log("✔✔✔ https://localhost: " + PORT)
})