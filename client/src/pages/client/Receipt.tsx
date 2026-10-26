import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/requests/placeOrderRequest";
import CurrentUser from "../../api/requests/userRequest";

import {
  LuCheck,
  LuMapPin,
  LuClock3,
  LuCreditCard,
  LuStore,
  LuBike,
} from "react-icons/lu";
import Button from "../../widgets/Button";
import { formatDateTime } from "../../utils/formatDateTime";
import toast from "react-hot-toast";

interface User {
  fname: string;
  lname: string;
  contact: string;
}

interface CurrentUser {
  profile: User;
  user: {
    id: string;
    email?: string;
  };
}

interface OrderItem {
  id: string;
  order_id: string;
  price_at_purchase: number;
  quantity: number;
  product_variants: {
    id: string;
    label: string;
    price: number;
    products: {
      id: string;
      name: string;
      image_url: string;
    };
  };
}

interface OrderReceipt {
  id: string;
  total_amount: number;
  subtotal: number;
  discount: number;
  delivery_fee: number;
  promo_code: string | null;
  payment_method: string;
  payment_status: string;
  order_status: string;
  ordered_date: string;
  completed_order_date: string | null;
  order_timing: string;
  scheduled_order_date: string | null;
  scheduled_order_time: string | null;
  order_instructions: string | null;
  delivery_method: string;
  address: {
    name: string | null;
    bldg_name: string | null;
    houseNum_roomNum: string | null;
    street_purok: string;
    barangay: string;
    city: string;
    province: string;
  } | null;
  order_items: OrderItem[];
}

function Receipt() {
  // --------------------------------------------- utilities ---------------------------------------------------
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  console.log(" Receipt mounted, id: ", id);

  // --------------------------------------------- states ------------------------------------------------------
  const [orderDetails, setOrderDetails] = React.useState<OrderReceipt | null>(
    null,
  );
  const [userInfos, setUserInfo] = React.useState<CurrentUser | null>(null);
  const [notFound, setNotFound] = React.useState(false);

  // --------------------------------------------- functions ---------------------------------------------------
  const fetchData = async () => {
    if (!id) return;

    try {
      const order = await api.getOrderReceipt(id);
      setOrderDetails(order);
    } catch (err) {
      console.error(err);
      toast.error("Failed to get specific order receipt.");
      setNotFound(true);
    }
  };

  const getLoggedInUser = async () => {
    try {
      const profile = await CurrentUser.getProfile();
      setUserInfo(profile);
    } catch (err) {
      console.error(err);
      toast.error("Cannot get logged in user");
    } finally {
      if (notFound) {
        return (
          <main className="mx-auto max-w-2xl px-4 py-12 text-center text-sm text-foreground/60">
            We couldn't find this receipt.
          </main>
        );
      }
    }
  };

  const address = orderDetails?.address;

  const addressLine = address
    ? [
        address.houseNum_roomNum,
        address.bldg_name,
        address.street_purok,
        address.barangay,
        address.city,
        address.province,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  // --------------------------------------------- useEffect -----------------------------------------------------

  React.useEffect(() => {
    fetchData().catch((err) => console.log(err));
  }, [id]);

  React.useEffect(() => {
    getLoggedInUser().catch((err) => console.error(err));
  }, []);

  if (!id) return toast.error("Invalid receipt link.");
  if (!orderDetails) return;
  if (!userInfos) return;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 md:py-8 lg:py-12">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-600">
          <LuCheck className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Thank you for your order!
        </h1>
        <p className="mt-2 text-sm text-foreground/55">
          We've received your order and the kitchen is on it.
        </p>
      </div>

      {/* Receipt card */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-sm">
        {/* Order info */}
        <div className="grid gap-4 border-b border-dashed border-foreground/20 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <p className="text-xs text-foreground/50">Order number</p>
            <p className="mt-0.5 text-sm font-semibold">
              #{orderDetails.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-foreground/50">Placed on</p>
            <p className="mt-0.5 text-sm font-semibold">
              {formatDateTime(orderDetails.ordered_date)}
            </p>
          </div>
          <div>
            <p className="text-xs text-foreground/50">Order status</p>
            {orderDetails.order_status === "Picked Up" ||
            orderDetails.order_status === "Delivered" ? (
              <span className="mt-1 inline-block rounded-full bg-tertiary/10 px-3 py-1 text-xs font-semibold text-tertiary">
                {" "}
                Orders Complete,{" "}
                {formatDateTime(orderDetails.completed_order_date)}{" "}
              </span>
            ) : (
              <span
                className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold
                ${
                  orderDetails.order_status === "Pending"
                    ? "text-primary bg-primary/10"
                    : orderDetails.order_status === "Processing"
                      ? "text-secondary bg-secondary/10"
                      : orderDetails.order_status === "Ready" ||
                          orderDetails.order_status === "On Delivery"
                        ? "text-tertiary bg-tertiary/10"
                        : "text-gray-400 bg-foreground/10"
                }
                `}
              >
                {orderDetails.order_status}
              </span>
            )}
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-foreground/50">Payment status</p>
            <span
              className={`mt-1 inline-block rounded-full  px-3 py-1 text-xs font-semibold
              ${orderDetails.payment_status === "Pending Payment" ? "text-foreground/70 bg-foreground/5" : "text-tertiary bg-tertiary/10"}
              `}
            >
              {orderDetails.payment_status}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="border-b border-dashed border-foreground/20 p-5 sm:p-6">
          <h2 className="font-semibold">Items</h2>
          <ul className="mt-4 grid gap-4">
            {orderDetails.order_items.map((i) => (
              <li className="flex gap-3" key={i.product_variants.products.id}>
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-foreground/5">
                  <img
                    src={i.product_variants.products.image_url}
                    alt={i.product_variants.products.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {i.product_variants.products.name}
                  </p>
                  <p className="mt-0.5 text-xs text-foreground/50">
                    {i.product_variants.label} · Qty {i.quantity}
                  </p>
                  <p className="mt-0.5 text-xs text-foreground/50">
                    ₱{i.product_variants.price.toFixed(2)} each
                  </p>
                </div>
                <p className="text-sm font-medium">
                  ₱{(i.product_variants.price * i.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Totals */}
        <div className="grid gap-3 border-b border-dashed border-foreground/20 p-5 sm:p-6">
          <div className="flex items-center justify-between text-sm text-foreground/60">
            <span>Subtotal</span>
            <span>₱{orderDetails.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-foreground/60">
            <span>Delivery fee</span>
            <span>₱{orderDetails.delivery_fee.toFixed(2)}</span>
          </div>
          {orderDetails.promo_code && (
            <div className="flex items-center justify-between text-sm text-green-600">
              <span>Promo discount ({orderDetails.promo_code})</span>
              <span>−₱{orderDetails.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="mt-1 flex items-center justify-between border-t border-foreground/10 pt-4">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">
              ₱{orderDetails.total_amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Order details */}
        <div className="grid gap-5 p-5 sm:p-6">
          {orderDetails.delivery_method === "pickup" ? (
            <div className="flex items-start gap-3">
              <LuStore className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">Pick Up</p>
                <p className="mt-0.5 text-sm text-foreground/60">
                  {userInfos.profile.fname} {userInfos.profile.lname} ·{" "}
                  {userInfos.profile.contact} · {userInfos.user.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <LuBike className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">Home delivery</p>
                <p className="mt-0.5 text-sm text-foreground/60">
                  {userInfos.profile.fname} {userInfos.profile.lname} ·{" "}
                  {userInfos.profile.contact} · {userInfos.user.email}
                </p>
              </div>
            </div>
          )}

          {orderDetails.delivery_method === "deliver" && (
            <div className="flex items-start gap-3">
              <LuMapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">Delivery address</p>
                <p className="mt-0.5 text-sm text-foreground/60">
                  {addressLine}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <LuClock3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">When</p>
              <p className="mt-0.5 text-sm text-foreground/60">
                {orderDetails.order_timing === "asap"
                  ? "As soon as possible"
                  : `${orderDetails.scheduled_order_date} at ${orderDetails.scheduled_order_time}`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <LuCreditCard className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Payment method</p>
              <p className="mt-0.5 text-sm text-foreground/60">
                {orderDetails.payment_method}
              </p>
            </div>
          </div>

          {orderDetails.order_instructions && (
            <div className="rounded-lg bg-foreground/[0.035] p-3 text-sm text-foreground/60">
              <p className="text-xs font-semibold text-foreground/75">
                Order instructions
              </p>
              <p className="mt-1">
                Please ring the doorbell twice. No onions on the pizza.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="cursor-pointer rounded-lg border border-foreground/15 px-3 py-3 text-sm font-medium transition hover:border-primary/50 hover:text-primary"
        >
          Print receipt
        </button>
        <Button.Solid
          name="Back to menu"
          type="button"
          onClick={() => nav("/menu")}
        />
      </div>
    </main>
  );
}

export default Receipt;
