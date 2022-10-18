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


export const refreshTokenGenerator = (uid, res) => {

    const expiresIn = 60 * 60 * 24 * 30

    try {
        const refreshToken = jwt.sign({uid}, process.env.JWT_REFRESH, {expiresIn})

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: !(process.env.MODE === 'developer'),
            expires: new Date(Date.now() + expiresIn * 1000)
        })

    } catch (error) {
        console.log(error)
    }
}