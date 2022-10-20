import { Link } from "../models/Link.js"

export const redirectLink = async (req, res) => {
    try {
        const {nanoLink} = req.params
        const link = await Link.findOne({nanoLink})

        if(!link) 
            return res.status(404).json({error: "Link not found or not exists"})
        
        return res.redirect(link.longLink)
    } catch (error) {
        console.log(error)
        if(error.kind === 'ObjectId'){
            return res.status(403).json({error: "Error de formato"})
        }
        return res.status(500).json({error: "Error del servidor"})
    }
}