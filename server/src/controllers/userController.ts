import type { Request, Response } from 'express'
import model from '../models/userModel';

async function add(req: Request, res: Response){

    try{
        const user = req.body
        const create = await model.addUsers(user);
        res.status(201).json(create)
    } catch(err){
        console.error(err)
        res.status(500).json({ error: (err as Error).message })
    }

} 

export default { add }