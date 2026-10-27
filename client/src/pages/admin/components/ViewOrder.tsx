import React from "react";
import type { IconType } from "react-icons";
import {
  LuBadgeAlert,
  LuBike,
  LuCalendarDays,
  LuClock3,
  LuCreditCard,
  LuMapPin,
  LuStickyNote,
  LuStore,
  LuUserRound,
  LuX,
} from "react-icons/lu";

import type { OrderDetails, OrderStatusUpdate } from "../../../utils/orderFlow";
import {
  getNextStatus,
  canCancel,
  type OrderStatus,
} from "../../../utils/orderFlow";
import { formatDateTime } from "../../../utils/formatDateTime";
import Button from "../../../widgets/Button";
import ConfirmationModal from "../../../components/ConfirmationModal";

interface Props {
  order: OrderDetails | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatusUpdate) => Promise<void>;
}

const actionLabel: Partial<Record<OrderStatus, string>> = {
  Preparing: "Start preparing",
  Ready: "Mark as ready",
  "Out for Delivery": "Send out for delivery",
  Delivered: "Mark as delivered",
  "Picked Up": "Mark as picked up",
};

// Same colors as the order cards on the list page
const statusStyles: Record<OrderStatus, { badge: string; dot: string }> = {
  Pending: { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  Preparing: { badge: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  Ready: { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  "Out for Delivery": {
    badge: "bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-500",
  },
  Delivered: { badge: "bg-green-50 text-green-700", dot: "bg-green-600" },
  "Picked Up": { badge: "bg-teal-50 text-teal-700", dot: "bg-teal-600" },
  Canceled: { badge: "bg-red-50 text-red-700", dot: "bg-red-500" },
};

const fallbackStyle = {
  badge: "bg-gray-100 text-gray-600",
  dot: "bg-gray-400",
};

const peso = (n: number) => `₱${Number(n).toFixed(2)}`;

// small icon + label + value block used in the details grid
function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: IconType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-foreground/50">{label}</p>
        <div className="mt-0.5 text-sm font-semibold wrap-break-word">
          {children}
        </div>
      </div>
    </div>
  );
}

function ViewOrder({ order, onClose, onUpdateStatus }: Props) {
  const [busy, setBusy] = React.useState<"payment" | "status" | null>(null);
  const [confirmCancel, setConfirmCancel] = React.useState(false);

  // reset when a different order opens
  React.useEffect(() => setConfirmCancel(false), [order?.id]);

  if (!order) return null; // isOpen is just "an order is selected"

  const next = getNextStatus(order.order_status, order.delivery_method);
  const style = statusStyles[order.order_status] ?? fallbackStyle;
  const isDelivery = order.delivery_method === "deliver";
  const isPaid = order.payment_status !== "Pending Payment";

  const address = order.address;
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

  const run = async (
    update: OrderStatusUpdate,
    key: "payment" | "status",
    close = true,
  ) => {
    if (busy) return; // ignore clicks while something is already updating
    setBusy(key);
    try {
      await onUpdateStatus(order.id, update);
      if (close) onClose();
    } catch {
      // parent already showed the error toast; keep the modal open
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-20 flex items-center justify-center bg-foreground/80 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-md/10"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-gray-200 p-5">
          <div className="min-w-0">
            <p className="text-xs text-foreground/50">Order number</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">
                #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                {order.order_status}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-foreground/50">
              Placed {formatDateTime(order.ordered_date)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-gray-400 transition hover:cursor-pointer hover:bg-foreground/5 hover:text-foreground"
          >
            <LuX className="h-5 w-5" />
          </button>
        </header>

        {/* Body */}
        <div className="overflow-y-auto scrollbar-none">
          {/* Customer */}
          <section className="border-b border-dashed border-foreground/20 p-5">
            <Detail icon={LuUserRound} label="Customer">
              {order.user_infos
                ? `${order.user_infos.fname} ${order.user_infos.lname}`
                : "Unknown customer"}
            </Detail>
          </section>

          {/* Fulfillment, timing, payment */}
          <section className="grid gap-5 border-b border-dashed border-foreground/20 p-5 sm:grid-cols-2">
            <Detail icon={isDelivery ? LuBike : LuStore} label="Fulfillment">
              {isDelivery ? "Home delivery" : "Store pickup"}
            </Detail>

            <Detail
              icon={
                order.order_timing === "schedule" ? LuCalendarDays : LuClock3
              }
              label="When"
            >
              {order.order_timing === "schedule" ? (
                <>
                  {order.scheduled_order_date}
                  <span className="block text-xs font-normal text-foreground/60">
                    at {order.scheduled_order_time}
                  </span>
                </>
              ) : (
                "As soon as possible"
              )}
            </Detail>

            <Detail icon={LuCreditCard} label="Payment method">
              {order.payment_method}
            </Detail>

            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <LuCreditCard className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs text-foreground/50">Payment status</p>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isPaid
                      ? "bg-green-50 text-green-700"
                      : "bg-foreground/5 text-foreground/70"
                  }`}
                >
                  {order.payment_status}
                </span>
                <span>
                  {!isPaid && order.order_status !== "Canceled" && (
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() =>
                        run({ payment_status: "Completed" }, "payment", false)
                      }
                      className="mt-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:cursor-pointer hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy === "payment" ? "Updating..." : "Mark as paid"}
                    </button>
                  )}
                </span>
              </div>
            </div>

            {isDelivery && (
              <div className="sm:col-span-2">
                <Detail icon={LuMapPin} label="Delivery address">
                  {address?.name && (
                    <span className="block text-xs font-medium text-primary">
                      {address.name}
                    </span>
                  )}
                  <span className="font-normal text-foreground/70">
                    {addressLine || "No address on file"}
                  </span>
                </Detail>
              </div>
            )}
          </section>

          {/* Notes */}
          {order.order_instructions && (
            <section className="border-b border-dashed border-foreground/20 p-5">
              <div className="flex items-start gap-3 rounded-xl bg-secondary/10 p-3.5">
                <LuStickyNote className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground/70">
                    Order instructions
                  </p>
                  <p className="mt-1 text-sm text-foreground/80 wrap-break-word">
                    {order.order_instructions}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Items */}
          <section className="border-b border-dashed border-foreground/20 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Items</h2>
              <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-foreground/55">
                {order.order_items.reduce((sum, o) => sum + o.quantity, 0)}{" "}
                total
              </span>
            </div>

            <ul className="grid gap-4">
              {order.order_items.map((o) => (
                <li key={o.id} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-foreground/5">
                    <img
                      className="absolute inset-0 h-full w-full object-cover"
                      src={o.product_variants.products.image_url}
                      alt={o.product_variants.products.name}
                    />
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                      {o.quantity}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold">
                        {o.product_variants.products.name}
                      </p>
                      <p className="shrink-0 text-sm font-medium">
                        {peso(o.product_variants.price * o.quantity)}
                      </p>
                    </div>
                    <p className="mt-0.5 text-xs text-foreground/50">
                      {o.product_variants.label || "Standard"} · Qty{" "}
                      {o.quantity}
                    </p>
                    <p className="mt-0.5 text-xs text-foreground/50">
                      {peso(o.product_variants.price)} each
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Totals */}
          <section className="grid gap-2.5 p-5">
            <div className="flex justify-between text-sm text-foreground/60">
              <span>Subtotal</span>
              <span>{peso(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-foreground/60">
              <span>Delivery fee</span>
              <span>
                {order.delivery_fee === 0 ? "Free" : peso(order.delivery_fee)}
              </span>
            </div>
            {order.promo_code && (
              <div className="flex justify-between text-sm text-foreground/60">
                <span>Promo discount ({order.promo_code})</span>
                <span>−{peso(order.discount)}</span>
              </div>
            )}
            <div className="mt-1 flex items-center justify-between border-t border-foreground/10 pt-3">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">
                {peso(order.total_amount)}
              </span>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-foreground/2 p-5 sm:flex-row sm:justify-end">
          {order.order_status === "Pending" && (
            <Button.Hollow
              name="Cancel order"
              type="button"
              onClick={() => setConfirmCancel(true)}
            />
          )}

          {next && (
            <Button.Solid
              name={
                busy ? "Updating..." : (actionLabel[next] ?? `Mark as ${next}`)
              }
              type="button"
              onClick={() => run({ order_status: next }, "status")}
            />
          )}
        </footer>
        <ConfirmationModal
          type="warning"
          title="Oops!"
          message={`Are you sure you want to cancel order #${order.id.slice(0, 8).toUpperCase()}?`}
          isOpen={confirmCancel}
          onClose={() => setConfirmCancel(false)}
          onConfirm={() => run({ order_status: "Canceled" }, "status")}
        />
      </div>
    </div>
  );
}

export default ViewOrder;
