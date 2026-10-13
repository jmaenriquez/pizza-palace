import type { Request, Response } from "express";
import model from "../models/productModel";

async function add(req: Request, res: Response) {
  try {
    const { name, description, category } = req.body;
    const variants = JSON.parse(req.body.variants ?? "[]");

    const id = await model.addProduct(
      { name, description, category, variants, img: req.file ?? null },
      res.locals.userId,
    );
    res.status(201).json({ id, message: "Product created successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
}

async function get(req: Request, res: Response) {
  try {
    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    res.json(await model.getProducts({ category, search }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;
    const variants = JSON.parse(req.body.variants ?? "[]");

    await model.updateProducts(String(id), {
      name,
      description,
      category,
      variants,
      img: req.file ?? null,
    });
    res.status(200).json({ id, message: `${name} updated successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
}

export default { add, get, update };
