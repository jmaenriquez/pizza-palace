import type { Request, Response } from 'express'
import model from '../models/productModel';

async function add(req: Request, res: Response){

    try{

        const { name, description, category } = req.body;
        const variants = JSON.parse(req.body.variants ?? '[]');

        const id = await model.addProduct({ name, description, category, variants, img: req.file ?? null }, 
            res.locals.userId
        );
        res.status(201).json({id, message: 'Product created successfully.'} )
    } catch(err){
        console.error(err)
        res.status(500).json({ error: (err as Error).message })
    }

}

export default { add }