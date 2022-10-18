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