import jwt from 'jsonwebtoken'
import { tokenVerificationErrors } from '../utils/tokenManager.js';

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
        return res.status(401).
        send({error: tokenVerificationErrors[error.message]})
    }
}