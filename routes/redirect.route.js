import {Router} from 'express'
import { redirectLink } from '../controllers/redirect.controllers.js'
const router = Router()

router.get('/:nanoLink', redirectLink)


export default router