import React from "react";
import type { IconType } from "react-icons";
import Fields from "../../widgets/Fields";
import Button from "../../widgets/Button";
import { useHeaderData } from "../../utils/hooks/useHeaderData";
import {
  LuSearch,
  LuClock,
  LuPackage,
  LuTruck,
  LuCircleCheck,
  LuCircleX,
} from "react-icons/lu";

type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Out for Delivery"
  | "Delivered"
  | "Picked Up"
  | "Canceled";

interface Order {
  id: string;
  name: string;
  item: string;
  total: string;
  status: OrderStatus;
  actions: string;
}

const orderItems: Order[] = [
  { id: "ODR-111", name: "John Doe", item: "Emperor Supreme", total: "₱304", status: "Preparing", actions: "View" },
  { id: "ODR-112", name: "Kelly Clarkson", item: "Emperor Supreme", total: "₱304", status: "Out for Delivery", actions: "View" },
  { id: "ODR-113", name: "Erick Lee", item: "Emperor Supreme", total: "₱304", status: "Delivered", actions: "View" },
  { id: "ODR-114", name: "Jarred Simpson", item: "Emperor Supreme", total: "₱304", status: "Picked Up", actions: "View" },
  { id: "ODR-115", name: "John Doe", item: "Emperor Supreme", total: "₱304", status: "Pending", actions: "View" },
  { id: "ODR-116", name: "John Doe", item: "Emperor Supreme", total: "₱304", status: "Canceled", actions: "View" },
  { id: "ODR-117", name: "Maria Santos", item: "Emperor Supreme", total: "₱304", status: "Ready", actions: "View" },
];

const statusColumns: { name: OrderStatus; color: string; icon: IconType }[] = [
  { name: "Pending", color: "bg-amber-500", icon: LuClock },
  { name: "Preparing", color: "bg-orange-500", icon: LuPackage },
  { name: "Ready", color: "bg-blue-500", icon: LuCircleCheck },
  { name: "Out for Delivery", color: "bg-indigo-500", icon: LuTruck },
  { name: "Delivered", color: "bg-green-600", icon: LuCircleCheck },
  { name: "Picked Up", color: "bg-teal-600", icon: LuCircleCheck },
  { name: "Canceled", color: "bg-red-500", icon: LuCircleX },
];

type Filter = "All" | OrderStatus;

const filterOpt: Filter[] = ["All", ...statusColumns.map((column) => column.name)];

function Orders() {
  const [orders] = React.useState<Order[]>(orderItems);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("All");

  useHeaderData("Order Management", "Track and manage your Pizza Palace orders.");

  // Search only (used for the chip counts so they match what the board shows)
  const searchedOrders = orders.filter((order) => {
    const searchTerm = search.toLowerCase();

    return (
      order.id.toLowerCase().includes(searchTerm) ||
      order.name.toLowerCase().includes(searchTerm) ||
      order.item.toLowerCase().includes(searchTerm)
    );
  });

  const getOrdersByStatus = (status: OrderStatus) =>
    searchedOrders.filter((order) => order.status === status);

  return (
    <div className="w-full min-w-0 bg-white px-4 pb-12 sm:px-6 xl:px-12">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4">
        {/* Search */}
        <Fields.Input
          icon={LuSearch}
          name="search"
          type="text"
          value={search}
          placeholder="Search order number, customer name, or item..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-2">
          {filterOpt.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
                filter === option
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 bg-white text-gray-500 hover:border-primary hover:text-primary"
              }`}
            >
              {option}
              {option !== "All" && (
                <span className="ml-2">
                  {searchedOrders.filter((order) => order.status === option).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div className="w-full overflow-x-auto scrollbar-none pb-4">
        <div className="flex min-h-100 items-start gap-4">
          {statusColumns
            .filter((column) => filter === "All" || column.name === filter)
            .map((column) => {
              const columnOrders = getOrdersByStatus(column.name);
              const StatusIcon = column.icon;

              return (
                <section
                  key={column.name}
                  className="w-70 min-w-70 self-stretch rounded-xl border border-gray-200 bg-white p-3"
                >
                  {/* Column header */}
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`h-3 w-3 shrink-0 rounded-full ${column.color}`}
                      />
                      <h2 className="truncate text-sm font-semibold text-gray-900">
                        {column.name}
                      </h2>
                    </div>

                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-600">
                      {columnOrders.length}
                    </span>
                  </div>

                  {/* Order cards */}
                  <div className="grid content-start gap-3">
                    {columnOrders.map((order) => (
                      <article
                        key={order.id}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                      >
                        {/* Order number */}
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-gray-500">
                            {order.id}
                          </span>

                          <StatusIcon
                            className="shrink-0 text-gray-400"
                            size={17}
                          />
                        </div>

                        {/* Product */}
                        <h3 className="mb-1 font-semibold text-gray-900">
                          {order.item}
                        </h3>

                        <p className="mb-4 text-sm text-gray-500">
                          {order.name}
                        </p>

                        <div className="mb-3 border-t border-gray-100" />

                        {/* Total and action */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-base font-bold text-gray-900">
                            {order.total}
                          </span>

                          <Button.Hollow
                            name={order.actions}
                            type="button"
                            onClick={() => console.log("View order:", order.id)}
                          />
                        </div>
                      </article>
                    ))}

                    {/* Empty state */}
                    {columnOrders.length === 0 && (
                      <div className="rounded-xl border border-dashed border-gray-300 px-3 py-8 text-center">
                        <p className="text-sm text-gray-400">No orders here</p>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Orders;