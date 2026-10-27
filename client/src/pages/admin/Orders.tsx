import React from "react";
import toast from "react-hot-toast";
import { LuSearch } from "react-icons/lu";

import api from "../../api/requests/placeOrderRequest";
import { useHeaderData } from "../../utils/hooks/useHeaderData";
import type {
  OrderDetails,
  OrderStatus,
  OrderItem,
  OrderStatusUpdate,
} from "../../utils/orderFlow";

import Fields from "../../widgets/Fields";
import Button from "../../widgets/Button";
import ViewOrder from "./components/ViewOrder";
import Skeleton from "../../components/reusable/SkeletonLoad";

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

const allStatuses = Object.keys(statusStyles) as OrderStatus[];

const activeStatuses: OrderStatus[] = [
  "Pending",
  "Preparing",
  "Ready",
  "Out for Delivery",
];

type Filter = "Active" | OrderStatus;
const filterOpt: Filter[] = ["Active", ...allStatuses];

const PAGE_SIZE = 10;

// One item shows its name, several items show "Multiple items"
const getItemLabel = (items: OrderItem[]) => {
  if (items.length === 0) return "No items";
  if (items.length === 1) {
    return items[0]?.product_variants.products.name ?? "1 item";
  }
  return "Multiple items";
};

function Orders() {
  // -------------------------------------- utilities ---------------------------------

  useHeaderData(
    "Order Management",
    "Track and manage your Pizza Palace orders.",
  );

  // ------------------------------------------ states -------------------------------------------

  const [orders, setOrders] = React.useState<OrderDetails[]>([]);
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<Filter>("Active");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = React.useState(true);

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const selected = orders.find((o) => o.id === selectedId) ?? null;

  // ------------------------------- useEffect -------------------------------

  React.useEffect(() => {
    async function fetchOrders() {
      try {
        setOrders(await api.getAllUserOrder());
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  // ------------------------------- functions -------------------------------

  const searchTerm = search.trim().toLowerCase().replace(/^#/, "");

  const searchedOrders = orders.filter(
    (o) =>
      searchTerm === "" ||
      o.id.toLowerCase().includes(searchTerm) ||
      o.order_items.some((i) =>
        i.product_variants.products.name.toLowerCase().includes(searchTerm),
      ),
  );

  const matchesFilter = (order: OrderDetails, option: Filter) => {
    if (option === "Active") {
      // While searching, look through finished orders too
      return searchTerm !== "" || activeStatuses.includes(order.order_status);
    }
    return order.order_status === option;
  };

  const filteredOrders = searchedOrders.filter((o) =>
    matchesFilter(o, selectedFilter),
  );
  const visibleOrders = filteredOrders.slice(0, visibleCount);

  const handleFilter = (option: Filter) => {
    setSelectedFilter(option);
    setVisibleCount(PAGE_SIZE);
  };

  const handleUpdateStatus = async (id: string, update: OrderStatusUpdate) => {
    try {
      await api.updateUserOrderStatus(id, update);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...update } : o)),
      );
      toast.success(
        update.order_status
          ? `Order marked as ${update.order_status}.`
          : "Payment marked as completed.",
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update the order.");
      throw err;
    }
  };

  return (
    <div className="w-full min-w-0 px-4 pb-12 sm:px-6 xl:px-12">
      <div className="mb-6 flex flex-col gap-4">
        <Fields.Input
          icon={LuSearch}
          name="search"
          type="text"
          value={search}
          placeholder="Search order number or item..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
        />

        {/* Select dropdown: mobile and tablet */}
        <div className="xl:hidden w-40">
          <Fields.Select
            name="filter"
            value={selectedFilter}
            optionsArray={filterOpt}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleFilter(e.target.value as Filter)
            }
          />
        </div>

        {/* Chips: desktop only */}
        <div className="hidden flex-wrap items-center gap-2 xl:flex">
          {filterOpt.map((option) => {
            const count = searchedOrders.filter((order) =>
              matchesFilter(order, option),
            ).length;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleFilter(option)}
                className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
                  selectedFilter === option
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
                }`}
              >
                {option}
                <span className="ml-2">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Order list */}
      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }, (_, i) => (
            <Skeleton.OrderCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleOrders.map((order) => {
            const style = statusStyles[order.order_status] ?? fallbackStyle;

            return (
              <article
                key={order.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-4 shadow-sm"
              >
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                      />
                      {order.order_status}
                    </span>
                  </div>

                  <h3 className="truncate font-semibold text-gray-900">
                    {getItemLabel(order.order_items)}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {order.user_infos.fname} {order.user_infos.lname}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-base font-bold text-gray-900">
                    ₱{Number(order.total_amount).toFixed(2)}
                  </span>
                  <Button.Hollow
                    name="View"
                    type="button"
                    onClick={() => setSelectedId(order.id)}
                  />
                </div>
              </article>
            );
          })}

          <ViewOrder
            order={selected}
            onClose={() => setSelectedId(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>

        
      )}

      {/* Empty state */}
      {!isLoading && filteredOrders.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 px-3 py-12 text-center">
          <p className="text-sm text-gray-400">No orders found</p>
        </div>
      )}

      {/* Show more */}
      {!isLoading && filteredOrders.length > visibleCount && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 transition-colors hover:border-primary hover:text-primary"
          >
            Show more ({filteredOrders.length - visibleCount})
          </button>
        </div>
      )}
    </div>
  );
}

export default Orders;
