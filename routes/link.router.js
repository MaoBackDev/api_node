import {Router} from 'express'
import { createLink, getLink, getLinks, removeLink, updateLink } from '../controllers/link.controller.js';
import { tokenRequired } from '../middlewares/tokenRequired.js';
import { bodyLinkValidator } from '../middlewares/validatorManager.js';
const router = Router()

// GET /api/v1/links all links
router.get('/', tokenRequired, getLinks)

// GET /api/v1/links:id single link
router.get('/:nanoLink', getLink)

// POST /api/v1/links create link
router.post('/', tokenRequired, bodyLinkValidator, createLink)

// PATCH/PUT /api/v1/links:id update link
router.patch('/:_id', tokenRequired, updateLink)
// DELETE /api/v1/links:id remove link
router.delete('/:_id', tokenRequired, bodyLinkValidator, removeLink)




export default router;