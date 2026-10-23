import type { Request, Response } from 'express'
import model from '../models/addToCartModel'


async function add(req:Request, res:Response){

    try{

        const { variantId, quantity } = req.body
        const add = await model.addToCart({ variantId, quantity }, res.locals.userId )
        res.status(201).json({add, message: 'Item added to cart successfully.'})

    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Failed to add item to cart.' })
    }
}

async function get(req:Request, res:Response){

    try{
        const userId = res.locals.userId as string;
        res.json(await model.getCartItems(userId));

    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Failed to get items in cart.' });
    }
}

async function update(req:Request, res:Response){

    try{
        const { id } = req.params
        const userId = res.locals.userId as string;
        const update = await model.updateItem(String(id), userId, req.body);
        res.status(200).json({update, message: 'Item updated successfully.'}) 

    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Failed to update item on cart' });
    }
}

async function remove(req: Request, res: Response){

    try{
        const { id } = req.params
        const userId = res.locals.userId as string;
        const removeItem = await model.removeFromCart(String(id), userId);
        res.status(200).json({removeItem, message: "Item removed successfully"});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
}


export default { add, get, update, remove }