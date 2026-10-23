import model from "../models/addressModel";
import type { Request, Response } from "express";

async function add(req: Request, res: Response) {
  try {
    const userId = res.locals.userId as string;
    const { bldg_name, houseNum_roomNum, street_purok, barangay, city, province, name } = req.body;
    const address = await model.createAddress(userId, {  bldg_name, houseNum_roomNum, street_purok, barangay, city, province, name, });
    res.status(201).json({ address, message: 'Address successfully created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create address." });
  }
}

async function get (_: Request, res: Response){

    try{
        const userId = res.locals.userId as string;
        const address = await model.getAddress(userId);
        res.status(200).json(address);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Failed to get address" });
    }
}

async function update(req: Request, res: Response){

    try{
        const userId = res.locals.userId as string;
        const { id } = req.params;
        const {  bldg_name, houseNum_roomNum, street_purok, barangay, city, province, name, } = req.body;
        const address = await model.updateAddress(userId, String(id), {  bldg_name, houseNum_roomNum, street_purok, barangay, city, province, name, })
        res.status(200).json({ address, message: 'Address susccessfully update.' });
        
    } catch(err){
        console.error(err);
        res.status(500).json({ message: 'Error updating address.' });
    }
}

async function dlt(req: Request, res: Response){
    try{

        const userId = res.locals.userId as string;
        const { id } = req.params;
        const address = await model.deleteAddress(userId, String(id));
        res.status(200).json({ message: 'Address deleted successfully.' });
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Failed to delete address." });
    }
}

export default { add, get, update, dlt }
