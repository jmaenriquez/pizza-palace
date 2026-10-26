import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { IconType } from "react-icons";
import {
  LuArrowLeft,
  LuBanknote,
  LuBike,
  LuCalendarDays,
  LuCheck,
  LuClock3,
  LuCreditCard,
  LuLandmark,
  LuMapPin,
  LuPackageCheck,
  LuPlus,
  LuSmartphone,
  LuStore,
  LuTag,
  LuUserRound,
} from "react-icons/lu";

import api from "../../api/requests/placeOrderRequest";
import addressAPI from "../../api/requests/addressRequest";
import CurrentUser from "../../api/requests/userRequest";
import CurrentUserAddress from "../../api/requests/addressRequest";

import Button from "../../widgets/Button";
import OptionCard from "../../widgets/OptionsCard";
import Section from "../../widgets/Sections";
import Form, { type FormItem } from "../../components/reusable/Form";

import { useCart } from "../../context/CartContext";

// ------------------------------------- types -------------------------------------

type DeliveryMethod = "pickup" | "deliver";
type PaymentMethod = "Cash" | "Card" | "Bank" | "Gcash";
type OrderTiming = "asap" | "schedule";

interface OrderItem {
  id: string;
  name: string;
  label: string | null;
  price: number;
  quantity: number;
  image: string;
}

interface Option<T extends string> {
  value: T;
  title: string;
  description: string;
  icon: IconType;
}

interface Address {
  bldg_name?: string;
  houseNum_roomNum?: string;
  street_purok: string;
  barangay: string;
  city: string;
  province: string;
}

interface User {
  fname: string;
  lname: string;
  email: string;
  contact: string;
  address?: Address[];
}

interface ItemsToOrder {
  id: string;
  quantity: number;

  product_variants: {
    id: string;
    label: string | null;
    price: number;
    products: {
      id: string;
      name: string;
      image_url: string;
    };
  };
}

interface CurrentUser {
  profile: User;
  user: {
    id: string;
    email?: string;
  };
}

interface UserAddress {
  id?: string;
  name: string;
  bldg_name: string;
  houseNum_roomNum: string;
  street_purok: string;
  barangay: string;
  city: string;
  province: string;
}

// --------------------------------- dummy data (replace later) ---------------------------------

const DELIVERY_FEE = 30;

const deliveryOptions: Option<DeliveryMethod>[] = [
  {
    value: "pickup",
    title: "Pickup",
    description: "Collect your order at our store",
    icon: LuStore,
  },
  {
    value: "deliver",
    title: "Delivery",
    description: `30–45 minutes · ₱${DELIVERY_FEE} fee`,
    icon: LuBike,
  },
];

const paymentOptions: Option<PaymentMethod>[] = [
  {
    value: "Cash",
    title: "Cash",
    description: "Pay when you receive your order",
    icon: LuBanknote,
  },
  {
    value: "Card",
    title: "Credit / debit card",
    description: "Visa, Mastercard, and more",
    icon: LuCreditCard,
  },
  {
    value: "Bank",
    title: "Bank transfer",
    description: "Transfer using your bank app",
    icon: LuLandmark,
  },
  {
    value: "Gcash",
    title: "GCash",
    description: "Pay using your GCash wallet",
    icon: LuSmartphone,
  },
];

const paymentHints: Record<PaymentMethod, string> = {
  Cash: "Please prepare the exact amount if possible. Payment is collected when your order arrives or at pickup.",
  Card: "In a real checkout, you would continue to a secure payment provider to enter your card details.",
  Bank: "Your bank transfer instructions and reference number would appear after the order is created.",
  Gcash:
    "In a real checkout, you would be redirected to a secure GCash payment flow.",
};

const peso = (n: number) => `₱${n.toFixed(2)}`;

const inputClassName =
  "w-full rounded-lg border border-foreground/15 bg-transparent px-3 py-3 text-sm outline-none transition placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/10";

const labelClassName = "mb-1.5 block text-sm font-medium";

// ---------------------------------------- page ----------------------------------------

function Checkout() {
  const nav = useNavigate();
  const loc = useLocation();
  const { refreshCart } = useCart();

  const [userInfo, setUserInfo] = React.useState<CurrentUser | null>(null);
  const [userAddress, setUserAddress] = React.useState<UserAddress[]>([]);
  const [checkedOutItems] = React.useState<ItemsToOrder[]>(
    loc.state?.checked_items ?? [],
  );

  const [address, setAddress] = React.useState("");
  const [scheduledDate, setScheduledDate] = React.useState("");
  const [scheduledTime, setScheduledTime] = React.useState("");
  const [orderNotes, setOrderNotes] = React.useState("");
  const [promoCode, setPromoCode] = React.useState("");

  const [delivery, setDelivery] = React.useState<DeliveryMethod>("pickup");
  const [payment, setPayment] = React.useState<PaymentMethod>("Cash");
  const [timing, setTiming] = React.useState<OrderTiming>("asap");
  const [promoApplied, setPromoApplied] = React.useState(false);

  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const items: OrderItem[] = checkedOutItems.map((i) => ({
    id: i.id,
    name: i.product_variants.products.name,
    label: i.product_variants.label,
    price: i.product_variants.price,
    quantity: i.quantity,
    image: i.product_variants.products.image_url,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const discount = promoApplied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const deliveryFee = delivery === "deliver" ? DELIVERY_FEE : 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  //   ------------------------------ functions ---------------------------------------------

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOrderNotes(e.target.value);
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "ROYAL10") {
      setPromoApplied(true);
      toast.success("Demo promo applied: 10% off!");
    } else {
      setPromoApplied(false);
      toast.error("Try the demo code ROYAL10.");
    }
  };

  const placeOrder = async () => {
    try {
      const { orderId } = await api.placeOrderRequest({
        cartItemsId: items.map((i) => i.id),
        delivery_method: delivery,
        payment_method: payment,
        order_timing: timing,
        scheduled_order_date: timing === "schedule" ? scheduledDate : undefined,
        scheduled_order_time: timing === "schedule" ? scheduledTime : undefined,
        order_instructions: orderNotes,
        addressId: delivery === "deliver" ? address : null,
        promo_code: promoCode,
      });

      toast.success("Order placed!");
      nav(`/receipt/${orderId}`, { replace: true });
      await refreshCart()
    } catch (err) {
      console.error(err);

      const errors = (err as { errors?: string[] }).errors;

      if (errors) {
        errors.forEach((msg) => toast.error(msg));
      } else {
        toast.error("Cannot proceed to place order, try again later.");
      }
    }
  };

  const getLoggedInUser = async () => {
    try {
      const profile = await CurrentUser.getProfile();
      setUserInfo(profile);
    } catch (err) {
      console.error(err);
      toast.error("Cannot get logged in user");
    }
  };

  const getUserAddress = async () => {
    try {
      const address = await CurrentUserAddress.getAddress();
      setUserAddress(address);

      if (address.length > 0) {
        setAddress(address[0].id);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to get User Address.");
    }
  };

  const closeForm = () => {
    setIsFormOpen(false)
  }

  const todayStr = React.useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const handleAddressSubmit = async (item: FormItem) => {
    try{
      await addressAPI.createAddress({
        name: item.name,
        bldg_name: item.bldg_name,
        houseNum_roomNum: item.houseNum_roomNum,
        street_purok: item.street_purok,
        barangay: item.barangay,
        city: item.city,
        province: item.province,
      })
      const addresses = await addressAPI.getAddress()
      setUserAddress(addresses)
    }catch(err){
      console.error(err);
      toast.error("Failed to create your address");
    }
  }

  //   ---------------------------------------------------- useEffect ----------------------------------

  React.useEffect(() => {
    getLoggedInUser();
  }, []);

  React.useEffect(() => {
    getUserAddress();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-8 lg:px-8 lg:py-12">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => nav("/cart")}
          className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm text-foreground/55 transition-all hover:text-primary hover:gap-3"
        >
          <span aria-hidden="true">
            {" "}
            <LuArrowLeft />{" "}
          </span>{" "}
          Back to cart
        </button>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Pizza Palace
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Checkout
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/55">
              One last step before your royal feast. Review your order and let
              us know how you would like to receive it.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full bg-foreground/5 px-3 py-2 text-xs font-medium text-foreground/60 sm:self-auto">
            <LuCheck className="h-4 w-4 text-primary" />
            Secure checkout preview
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="grid gap-5 lg:col-span-2">
          {/* Contact details */}
          <Section
            title="Contact information"
            subtitle="We'll use these details for order updates and pickup or delivery questions."
            icon={LuUserRound}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {userInfo?.profile.fname} {userInfo?.profile.lname}
                </h1>
                <p className="text-gray-400">{userInfo?.profile.contact}</p>
              </div>
              <p className="text-gray-500">{userInfo?.user.email}</p>
            </div>
          </Section>

          {/* Fulfillment */}
          <Section
            title="How would you like your order?"
            subtitle="Choose pickup or have your order delivered to your door."
            icon={delivery === "pickup" ? LuStore : LuBike}
          >
            <div
              role="radiogroup"
              aria-label="Fulfillment method"
              className="grid gap-3 sm:grid-cols-2"
            >
              {deliveryOptions.map((option) => (
                <OptionCard
                  key={option.value}
                  selected={delivery === option.value}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  onSelect={() => setDelivery(option.value)}
                />
              ))}
            </div>

            {delivery === "pickup" ? (
              <div className="rounded-xl border border-foreground/10 bg-foreground/2.5 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
                    <LuMapPin className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold">Pizza Palace — Main Store</p>
                    <p className="mt-1 text-sm text-foreground/60">
                      123 Sample Street, Vigan City, Ilocos Sur
                    </p>
                    <p className="mt-2 text-xs text-foreground/50">
                      Open daily · 10:00 AM – 10:00 PM
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userAddress.map((a) => {
                  const addressLine = [a.houseNum_roomNum, a.bldg_name, a.street_purok, a.barangay, a.city, a.province].filter(Boolean).join(", ");
                  return (
                    <OptionCard
                      key={a.id}
                      selected={address === a.id}
                      title={a.name}
                      description={addressLine}
                      onSelect={() => setAddress(a.id!)}
                    />
                  );
                })}

                <div
                  onClick={() => setIsFormOpen(true)}
                  className="p-4 border border-dashed rounded-lg flex gap-4 items-center text-gray-400 hover:bg-foreground/10 hover:cursor-pointer"
                >
                  <div className="p-4 border border-dashed">
                    <LuPlus className="w-5 h-5" />
                  </div>

                  <p className="text-sm">Add Address</p>
                </div>

                <Form
                  addTitle="Input Address"
                  editTitle={`Edit Address`}
                  isOpen={isFormOpen}
                  onClose={closeForm}
                  onOutsideClick={closeForm}
                  toastMessage={"Address successfully created!"}
                  fields={[
                    {
                      label: "Address Name",
                      fieldtype: "input",
                      name: "name",
                      type: "text",
                      placeholder: "Work, School, Home",
                    },
                    {
                      label: "Bldg. Name",
                      fieldtype: "input",
                      name: "bldg_name",
                      type: "text",
                      placeholder: "The Estate Makati",
                    },
                    {
                      label: "House/Room Number",
                      fieldtype: "input",
                      name: "houseNum_roomNum",
                      type: "text",
                      placeholder: "Unit 15A",
                    },
                    {
                      label: "Street/Purok",
                      fieldtype: "input",
                      name: "street_purok",
                      type: "text",
                      placeholder: "6747 Ayala Ave. ",
                    },
                    {
                      label: "Barangay",
                      fieldtype: "input",
                      name: "barangay",
                      type: "text",
                      placeholder: "Urdaneta",
                    },
                    {
                      label: "City",
                      fieldtype: "input",
                      name: "city",
                      type: "text",
                      placeholder: "Makati City",
                    },
                    {
                      label: "Province",
                      fieldtype: "input",
                      name: "province",
                      type: "text",
                      placeholder: "Metro Manila",
                    },
                  ]}
                  onSubmit={handleAddressSubmit}
                />
              </div>
            )}

            <div className="border-t border-foreground/10 pt-4">
              <div className="mb-3 flex items-center gap-2">
                <LuClock3 className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">When do you want it?</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <OptionCard
                  selected={timing === "asap"}
                  title="As soon as possible"
                  description={
                    delivery === "pickup"
                      ? "Ready in about 20 minutes"
                      : "Estimated in 30–45 minutes"
                  }
                  icon={LuClock3}
                  onSelect={() => setTiming("asap")}
                />
                <OptionCard
                  selected={timing === "schedule"}
                  title="Schedule for later"
                  description="Choose a preferred date and time"
                  icon={LuCalendarDays}
                  onSelect={() => setTiming("schedule")}
                />
              </div>
              {timing === "schedule" && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClassName} htmlFor="scheduledDate">
                      Preferred date
                    </label>
                    <input
                      id="scheduledDate"
                      type="date"
                      min={todayStr}
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className={labelClassName} htmlFor="scheduledTime">
                      Preferred time
                    </label>
                    <select
                      id="scheduledTime"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className={inputClassName}
                    >
                      <option value="">Choose a time</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="12:30 PM">12:30 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="4:30 PM">4:30 PM</option>
                    </select>
                  </div>
                  <p className="text-xs text-foreground/45 sm:col-span-2">
                    Preview only: validate store hours and available slots with
                    your backend later.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className={labelClassName} htmlFor="notes">
                Order instructions{" "}
                <span className="text-xs font-normal text-foreground/45">
                  (optional)
                </span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={orderNotes}
                onChange={onChange}
                placeholder={
                  delivery === "deliver"
                    ? "Instructions for the rider or store..."
                    : "Any special requests for the kitchen..."
                }
                className={`${inputClassName} resize-y`}
              />
            </div>
          </Section>

          {/* Payment */}
          <Section
            title="Payment method"
            subtitle="Select how you plan to pay for this order."
            icon={LuCreditCard}
          >
            <div
              role="radiogroup"
              aria-label="Payment method"
              className="grid gap-3 sm:grid-cols-2"
            >
              {paymentOptions.map((option) => (
                <OptionCard
                  key={option.value}
                  selected={payment === option.value}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  onSelect={() => setPayment(option.value)}
                />
              ))}
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-foreground/[0.035] p-3 text-sm text-foreground/60">
              <LuPackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>{paymentHints[payment]}</p>
            </div>
            <p className="text-xs text-foreground/40">
              Payment methods are placeholders for the UI. Only enable methods
              you can actually process.
            </p>
          </Section>

          {/* Promo code */}
          <Section
            title="Promo code"
            subtitle="Have a royal treat code? Add it here."
            icon={LuTag}
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  setPromoApplied(false);
                }}
                placeholder="Enter promo code"
                aria-label="Promo code"
                className={inputClassName}
              />
              <button
                type="button"
                onClick={applyPromo}
                className="shrink-0 rounded-lg border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
              >
                Apply code
              </button>
            </div>
            {promoApplied && (
              <p className="text-sm font-medium text-green-600">
                {promoCode} applied — 10% demo discount added.
              </p>
            )}
            <p className="text-xs text-foreground/45">
              Layout demo: use <span className="font-semibold">ROYAL10</span> to
              preview a 10% discount. This is not a real promotion.
            </p>
          </Section>
        </div>

        {/* Order summary */}
        <aside className="overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-sm lg:sticky lg:top-6">
          <div className="border-b border-foreground/10 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Order summary</h2>
              <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-foreground/55">
                {items.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>

            <ul className="mt-5 grid gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-foreground/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <p className="text-sm font-semibold leading-snug">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-foreground/50">
                      {item.label ? `${item.label} · ` : ""}Qty {item.quantity}
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {peso(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => nav("/cart")}
              className="mt-5 w-full cursor-pointer rounded-lg border border-foreground/15 px-3 py-2.5 text-sm font-medium transition hover:border-primary/50 hover:text-primary"
            >
              Edit cart
            </button>
          </div>

          <div className="grid gap-3 p-5 sm:p-6">
            <div className="flex items-center justify-between text-sm text-foreground/60">
              <span>Subtotal</span>
              <span>{peso(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-foreground/60">
              <span>Delivery fee</span>
              <span>{deliveryFee === 0 ? "Free" : peso(deliveryFee)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>Promo discount (10%)</span>
                <span>−{peso(discount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-foreground/10 pt-4">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">
                {peso(total)}
              </span>
            </div>

            <div className="rounded-lg bg-foreground/[0.035] p-3 text-xs leading-relaxed text-foreground/55">
              <p className="font-semibold text-foreground/75">
                Selected options
              </p>
              <p className="mt-1">
                {delivery === "pickup" ? "Store pickup" : "Home delivery"} ·{" "}
                {timing === "asap" ? "As soon as possible" : "Scheduled"}
              </p>
              <p className="mt-1">
                Pay by{" "}
                {
                  paymentOptions.find((option) => option.value === payment)
                    ?.title
                }
              </p>
            </div>

            <Button.Solid
              name={`Place order · ${peso(total)}`}
              type="button"
              onClick={placeOrder}
            />
            <p className="text-center text-[11px] leading-relaxed text-foreground/40">
              By placing your order, you confirm that your order details are
              correct.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;
