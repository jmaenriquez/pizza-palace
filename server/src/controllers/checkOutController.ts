import type { Request, Response } from "express";
import model from "../models/checkoutModel";
import cartModel from "../models/addToCartModel";
import computePrice from "../services/computePriceService";

async function placeOrder(req: Request, res: Response) {
  try {
    const userId = res.locals.userId as string;
    const {
      cartItemsId,
      delivery_method,
      payment_method,
      order_timing,
      scheduled_order_date,
      scheduled_order_time,
      order_instructions,
      addressId,
      promo_code,
    } = req.body ?? {};

    if (!Array.isArray(cartItemsId) || cartItemsId.length === 0) {
      return res.status(400).json({ error: "No items selected." });
    }

    if (delivery_method !== "pickup" && delivery_method !== "deliver")
      return res.status(400).json({ error: "Invalid delivery method." });

    // 1. real data from the DB
    const rows = await cartModel.getCartItems(userId, cartItemsId);
    if (rows.length !== cartItemsId.length) {
      return res.status(400).json({ error: "Some cart items are invalid." });
    }

    // 2. build order_items from those rows
    const order_items = rows.map((r) => ({
      variantId: r.product_variants.id,
      price: r.product_variants.price,
      quantity: r.quantity,
    }));

    // 3. THE COMPUTATION: service call, using DB prices only
    const t = computePrice(order_items, delivery_method, promo_code);

    // 4. save
    const orderId = await model.placeOrder(
      {
        cartItemsId: cartItemsId,
        addressId: delivery_method === "deliver" ? addressId : null,
        payment_method,
        order_timing,
        scheduled_order_date:
          order_timing === "schedule" ? scheduled_order_date : undefined,
        scheduled_order_time:
          order_timing === "schedule" ? scheduled_order_time : undefined,
        order_instructions,
        order_items,
        delivery_method,
        promo_code: t.discount > 0 ? promo_code : undefined,
        totals: {
          subtotal: t.actualPrice,
          discount: t.discount,
          delivery_fee: t.delivery,
          total: t.overall,
        },
      },
      userId,
    );

    res.status(201).json({ orderId, message: "Order placed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order." });
  }
}

async function getReceipt(req: Request, res: Response) {
  
    try{

        const userId = res.locals.userId;
        const { id } = req.params
        const order = await model.getOrder(userId, String(id))
        res.status(200).json(order);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Failed to get order details." });
    }
}

async function getAllOrders(req: Request, res: Response){
    try{
        const userId = res.locals.userId;
        const orders = await model.getOrder(userId);
        res.status(200).json(orders);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Failed to get all orders" })
    }
}

export default { placeOrder, getReceipt, getAllOrders };
