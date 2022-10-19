import {Router} from 'express';
import { infoUser, login, logout, refreshToken, register } from '../controllers/auth.controller.js';
import { tokenRequired } from '../middlewares/tokenRequired.js';
import { requireRefreshToken } from '../middlewares/requireRefreshToken.js';
import { bodyLoginValidator, bodyRegisterValidator } from '../middlewares/validatorManager.js';
const router = Router();

/**
 * IMPORTANTE: Las rutas deben ser controladas en el archivo controlador
 * Validación de campos: Para validar los campos usamos el paquete de express.validator. Importamos body para capturar los valores que se envían a traves del req.
 */
router.post('/register', bodyRegisterValidator, register)

router.post('/login', bodyLoginValidator, login)


// Ruta Protegida
router.get('/protected', tokenRequired, infoUser)

// Ruta para el refresh token
router.get('/refresh', requireRefreshToken, refreshToken)

// logout
router.get('/logout', logout)


// Permite ser usado en otros módulos y asignarle el nombre que se necesite
export default router;