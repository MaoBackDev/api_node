// Function to generate token with JWT
import jwt from 'jsonwebtoken'

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