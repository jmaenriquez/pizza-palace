import model from "../models/userModel";
import type { Request, Response } from "express";

async function get(req: Request, res: Response) {
  try {
    const userId = res.locals.userId as string;
    const user = await model.getUser(userId);
    res.status(200).json({ profile: user.profile, user: user.data, orders: user.orders, message: "User successfully loaded." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get user profile." });
  }
}

async function update(req: Request, res: Response) {
  try {
    const userId = res.locals.userId as string;
    const { fname, mname, lname, contact, birthday } = req.body;
    const newProfile = await model.editUserProfile(userId, {
      fname,
      mname,
      lname,
      contact,
      birthday,
    });
    res.status(200).json({ newProfile, message: "User profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user profile" });
  }
}

async function deleteUser(req:Request, res:Response){

  try{
    const userId = res.locals.userId as string

    if(userId === "5207efef-62e1-41d9-a11d-77848756b7ac"){
      throw new Error("You cannot delete the test account");
    }

    await model.deleteUser(userId);
    res.status(200).json({ message: "Account deleted successfully." });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
}

export default { get, update, deleteUser };
