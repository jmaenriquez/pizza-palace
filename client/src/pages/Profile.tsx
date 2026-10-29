import React from "react";
import supabase from "../config/supabase";
import toast from "react-hot-toast";

import type { FormItem } from "../components/reusable/Form";
import type { IconType } from "react-icons";
import {
  LuChevronRight,
  LuKeyRound,
  LuLogOut,
  LuMail,
  LuMapPin,
  LuPencil,
  LuPhone,
  LuPlus,
  LuReceipt,
  LuTrash2,
  LuUserRound,
} from "react-icons/lu";

import api from "../api/requests/userRequest";
import orderAPI from "../api/requests/placeOrderRequest";
import addressAPI from "../api/requests/addressRequest";
import { formatDate } from "../utils/formatDateTime";

import Form from "../components/reusable/Form";
import Button from "../widgets/Button";

interface User {
  fname: string;
  lname: string;
  contact: string;
  created_at: string;
}

interface CurrentUser {
  profile: User;
  user: {
    id: string;
    email: string;
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

interface Address {
  id: string;
  name: string;
  bldg_name: string;
  houseNum_roomNum: string;
  street_purok: string;
  barangay: string;
  city: string;
  province: string;
}

// ------------------------------- hardcoded data (replace later) -------------------------------

const recentOrders = [
  {
    id: "D03F3CCF",
    date: "Oct 23, 2026",
    total: 908.4,
    status: "Pending",
    items: "Emperor Supreme + 2 more",
  },
  {
    id: "A91C22B0",
    date: "Oct 18, 2026",
    total: 349,
    status: "Delivered",
    items: "Royal Tropic",
  },
  {
    id: "7E40BD15",
    date: "Oct 11, 2026",
    total: 478,
    status: "Picked Up",
    items: "Knight's Shield + 1 more",
  },
];
const statusStyles: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Preparing: "bg-orange-50 text-orange-700",
  Ready: "bg-blue-50 text-blue-700",
  "Out for Delivery": "bg-indigo-50 text-indigo-700",
  Delivered: "bg-green-50 text-green-700",
  "Picked Up": "bg-teal-50 text-teal-700",
  Canceled: "bg-red-50 text-red-700",
};

const peso = (n: number) => `₱${n.toFixed(2)}`;

// ------------------------------- small building blocks -------------------------------

function Card({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-dashed border-foreground/20 p-5 sm:p-6">
        <div className="min-w-0">
          <h2 className="font-semibold">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-foreground/55">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: IconType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-foreground/50">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

const ghostButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-foreground/15 px-3 py-2 text-sm font-medium transition hover:border-primary/50 hover:text-primary";

// ------------------------------------ page ------------------------------------

function Profile() {
  // -------------------------------------------------------- states ---------------------------------------
  const [userProfile, setUserProfile] = React.useState<CurrentUser | null>(
    null,
  );
  const [orders, setOrders] = React.useState<OrderReceipt[]>([]);
  const [address, setAddress] = React.useState<Address[]>([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  // --------------------------------------------- utilities -----------------------------------------------------------

  const initials =
    `${userProfile?.profile.fname[0]}${userProfile?.profile.lname[0]}`.toUpperCase();

  const ACTIVE_STATUS = ["Pending", "Preparing", "Ready", "Out for Delivery"];
  const activeOrders = orders.filter((order) =>
    ACTIVE_STATUS.includes(order.order_status),
  );

  const stats = [
    { label: "Orders", value: orders.length },
    { label: "Active", value: activeOrders.length },
    { label: "Saved addresses", value: address.length },
  ];
  // -------------------------------------------------- functions ------------------------------------------------------

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleAddressSubmit = async (item: FormItem) => {
    try {
      await addressAPI.createAddress({
        name: item.name,
        bldg_name: item.bldg_name,
        houseNum_roomNum: item.houseNum_roomNum,
        street_purok: item.street_purok,
        barangay: item.barangay,
        city: item.city,
        province: item.province,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create your address");
    }
  };

  // ---------------------------------------------------- useEffects --------------------------------------------------

  React.useEffect(() => {
    async function getUserProfile() {
      try {
        const profile = await api.getProfile();
        setUserProfile(profile);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user profile.");
      }
    }

    getUserProfile();
  }, []);

  React.useEffect(() => {
    async function getUserOrders() {
      try {
        const order = await orderAPI.getAllOrder();
        setOrders(order);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user orders.");
      }
    }

    getUserOrders();
  }, []);

  React.useEffect(() => {
    async function getAddress() {
      try {
        const addresses = await addressAPI.getAddress();
        setAddress(addresses);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user's stored addresses.");
      }
    }

    getAddress();
  }, []);

  if (!userProfile) return;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-24 sm:px-6 md:py-8 md:pb-8 lg:px-8 lg:py-12">
      {/* Identity banner */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-sm">
        <div className="h-20 bg-linear-to-r from-primary/25 via-secondary/25 to-tertiary/25 sm:h-24" />
        <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-6">
          <div className="-mt-10 flex items-end gap-4 sm:-mt-12">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary text-2xl font-bold text-background shadow-sm sm:h-24 sm:w-24 sm:text-3xl">
              {initials}
              {/* <img src="JM_3 1.png" alt="" /> */}
            </div>
            <div className="min-w-0 pb-1">
              <h2 className="truncate text-xl font-bold sm:text-2xl">
                {userProfile.profile.fname} {userProfile.profile.lname}
              </h2>
              <p className="truncate text-sm text-foreground/55">
                Member since {formatDate(userProfile.profile.created_at)}
              </p>
            </div>
          </div>

          <button type="button" className={ghostButton}>
            <LuPencil className="h-4 w-4" />
            Edit profile
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-dashed divide-foreground/20 border-t border-dashed border-foreground/20">
          {stats.map((s) => (
            <div key={s.label} className="px-3 py-4 text-center sm:py-5">
              <p className="text-xl font-bold text-primary sm:text-2xl">
                {s.value}
              </p>
              <p className="mt-0.5 text-xs text-foreground/55">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Left column */}
        <div className="grid gap-6 lg:col-span-2">
          {/* Personal info */}
          <Card
            title="Personal information"
            subtitle="Used for order updates and pickup or delivery questions."
            action={
              <button type="button" className={ghostButton}>
                <LuPencil className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            }
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                icon={LuUserRound}
                label="First name"
                value={userProfile.profile.fname}
              />
              <Field
                icon={LuUserRound}
                label="Last name"
                value={userProfile.profile.lname}
              />
              <Field
                icon={LuMail}
                label="Email"
                value={userProfile.user.email}
              />
              <Field
                icon={LuPhone}
                label="Contact number"
                value={userProfile.profile.contact}
              />
            </div>
          </Card>

          {/* Addresses */}
          <Card
            title="Saved addresses"
            subtitle="Choose one of these at checkout for delivery."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {address.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col gap-3 rounded-xl border border-foreground/10 p-4 transition hover:border-primary/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <LuMapPin className="h-4 w-4 shrink-0 text-primary" />
                      <p className="truncate font-semibold">{a.name}</p>
                      {/* { (
                        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          Default
                        </span>
                      )} */}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        aria-label={`Edit ${a.name}`}
                        className="rounded-md p-1.5 text-foreground/40 transition hover:bg-foreground/5 hover:text-primary"
                      >
                        <LuPencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${a.name}`}
                        className="rounded-md p-1.5 text-foreground/40 transition hover:bg-foreground/5 hover:text-primary"
                      >
                        <LuTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/60">
                    {[
                      a.houseNum_roomNum,
                      a.bldg_name,
                      a.street_purok,
                      a.barangay,
                      a.city,
                      a.province,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              ))}

              {/* Add address */}
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
          </Card>
        </div>

        {/* Right column */}
        <div className="grid gap-6">
          {/* Recent orders */}
          <Card
            title="Recent orders"
            action={
              <button
                type="button"
                className="text-xs font-medium text-primary hover:underline"
              >
                View all
              </button>
            }
          >
            <ul className="grid gap-3">
              {recentOrders.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-foreground/10 p-3 text-left transition hover:border-primary/50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-foreground/50 group-hover:text-primary">
                      <LuReceipt className="h-5 w-5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">#{o.id}</p>
                        <p className="text-sm font-bold">{peso(o.total)}</p>
                      </div>
                      <p className="truncate text-xs text-foreground/55">
                        {o.items}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[o.status] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {o.status}
                        </span>
                        <span className="text-[11px] text-foreground/45">
                          {o.date}
                        </span>
                      </div>
                    </div>

                    <LuChevronRight className="h-4 w-4 shrink-0 text-foreground/30 group-hover:text-primary" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {/* Account */}
          <Card title="Account">
            <div className="grid gap-3">
              <button type="button" className={`${ghostButton} justify-start`}>
                <LuKeyRound className="h-4 w-4 text-primary" />
                Change password
              </button>
              <Button.Solid
                      icon={LuLogOut}
                      name="Log out"
                      type="button"
                      onClick={async () => {
                        await supabase.auth.signOut();
                      }}
                      iconRight={true}
                    />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default Profile;
