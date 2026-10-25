import type { Request, Response, NextFunction } from "express";
import { error } from "node:console";

function validateOrder(req: Request, res: Response, next: NextFunction) {
  const {
    cartItemsId,
    delivery_method,
    payment_method,
    order_timing,
    scheduled_order_date,
    scheduled_order_time,
    addressId,
  } = req.body;

  const errors: string[] = [];

  if (!Array.isArray(cartItemsId) || cartItemsId.length === 0) {
    errors.push("There are no items in the order.");
  }
  if (!delivery_method) {
    errors.push("You should pick a delivery method.");
  }
  if (delivery_method === "deliver" && !addressId) {
    errors.push("You have not selected an address.");
  }
  if (!order_timing) {
    errors.push("Please pick an order timing.");
  }
  if (order_timing === "schedule") {
    const todayDate = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Manila",
    });
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

    if (typeof scheduled_order_date !== "string" || !scheduled_order_date) {
      errors.push("Please select a preferred date of delivery.");
    } else if (!dateFormat.test(scheduled_order_date)) {
      errors.push("Date must be in YYYY-MM-DD format.");
    } else if (scheduled_order_date < todayDate) {
      errors.push("Date must be today or in the future.");
    }

    if (!scheduled_order_time) {
      errors.push("Please select a preferred time of delivery.");
    }
  }
  if (!payment_method) {
    errors.push("Please select a payment method.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

export default validateOrder;
