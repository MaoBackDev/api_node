import cookieParser from 'cookie-parser';  // cookies
import 'dotenv/config' // enviroment variables
import './database/connectdb.js' // Database conectction module
import express from 'express'  // Import express
import authRouter from './routes/auth.route.js';

const PORT = process.env.PORT || 5000  
const app = express()           // object express
app.use(express.json())  // Permite leer las solicitidues en json
app.use(cookieParser())  // Permite usar cookie-parser

// Routs
app.use('/api/v1/user', authRouter)



// Listen method to server connection
app.listen(PORT, () => {
    console.log("✔✔✔ https://localhost: " + PORT)
})