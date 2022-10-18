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


export const tokenRequiredCookie = (req, res, next) => {

    try {
        // Recuperamos el token enviado a través del request
        let token = req.cookies.token; 

        // Validar que el token sea válido
        if(!token) throw new Error('No bearer')
        
        // Separamos el formato bearer del token para no generar errores
        // token = token.split(' ')[1]

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

export const tokenRequiredLocalStorage = (req, res, next) => {

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

