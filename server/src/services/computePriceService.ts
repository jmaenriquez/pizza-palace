import model from '../models/addToCartModel'

interface ItemPrices{
    price: number,
    quantity: number,
}

const PROMOS: Record<string, number> = {
  ROYAL10: 0.1, // 10% off
};

type DeliveryMethod = "pickup" | "deliver";

const delivery_fee = 30;
const roundPrice = (n: number) => Math.round(n * 100) /100;

function computePrice( items: ItemPrices[], method: DeliveryMethod, promoCode?: string ){

    const actualPrice = roundPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0));

    const rate = promoCode ? PROMOS[promoCode.trim().toUpperCase()] ?? 0 : 0;
    const discount = roundPrice(actualPrice * rate);
    const delivery = method === "deliver" ? delivery_fee : 0

    const overall = Math.max(0, roundPrice(actualPrice + delivery - discount))

    return { actualPrice, discount, delivery, overall};
}

export default computePrice;