import model from "../models/userModel";
import type { Request, Response } from "express";

async function get(req: Request, res: Response) {
  try {
    const userId = res.locals.userId as string;
    const user = await model.getUser(userId);
    res.status(200).json({ profile: user.profile, user: user.data  , message: "User successfully fetched" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get user profile." });
  }
}

async function update(req: Request, res: Response) {
  try {
    const userId = res.locals.userId as string;
    const { email, fname, mname, lname, contact, birthday } = req.body;
    const newProfile = await model.editUserProfile(userId, {
      email,
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

export default { get, update };
