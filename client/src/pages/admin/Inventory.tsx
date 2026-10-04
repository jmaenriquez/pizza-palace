import React from "react";

import { Constants } from "../../api/database.types";
import api, { type Product } from "../../api/requests/productRequest";

import Button from "../../widgets/Button";
import Fields from "../../widgets/Fields";
import Form, {
  type FormItem,
  type FormFiles,
  type FormLists,
} from "../../components/reusable/Form";

import { useHeaderData } from "../../utils/hooks/useHeaderData";
import type { IconType } from "react-icons";
import { LuEllipsisVertical, LuPlus, LuSearch } from "react-icons/lu";

interface stockItems {
  sku: string;
  img: string;
  name: string;
  description: string;
  price: number;
  stocks: number;
  actions: IconType;
}

interface FilterValues {
  name: string;
  value: string;
}

function Inventory() {
  // ------------------------------------------utilities--------------------------------------
  useHeaderData("Menu");

  const items: stockItems[] = [
    {
      sku: "ES-260901",
      img: "/Menu/Pizzas/Emperor Supreme.webp",
      name: "Emperor Supreme",
      description:
        "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
      price: 349,
      stocks: 9999,
      actions: LuEllipsisVertical,
    },

    {
      sku: "ES-260902",
      img: "/Menu/Pizzas/Emperor Supreme.webp",
      name: "Emperor Supreme",
      description:
        "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
      price: 349,
      stocks: 9999,
      actions: LuEllipsisVertical,
    },

    {
      sku: "ES-260903",
      img: "/Menu/Pizzas/Emperor Supreme.webp",
      name: "Emperor Supreme",
      description:
        "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
      price: 349,
      stocks: 9999,
      actions: LuEllipsisVertical,
    },

    {
      sku: "ES-260904",
      img: "/Menu/Pizzas/Emperor Supreme.webp",
      name: "Emperor Supreme",
      description:
        "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
      price: 349,
      stocks: 9999,
      actions: LuEllipsisVertical,
    },
  ];

  const categories = [...Constants.public.Enums.product_category_enums];

  // for filter button
  const filter: FilterValues[] = [
    { name: "All", value: "" },
    { name: "Classic", value: "Classic" },
    { name: "Royal Feast", value: "Meat" },
    { name: "Veggie Royale", value: "Vegetarian" },
    { name: "Court Treats", value: "Others" },
    { name: "Royal Refreshments", value: "Beverages" },
  ];

  // -------------------------------States----------------------------------------
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<Record<
    string,
    string
  > | null>(null);

  const [filterValue, setFilterValue] = React.useState("");

  // -------------------------------Functions-------------------------------------

  const selectedName =
    filter.find((f) => f.value === filterValue)?.name ?? "All";
  const searchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const openForm = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const editForm = (item: Record<string, string>) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const toVariants = (rows: Record<string, string>[]) => {
  if (rows.some((r) => r.price.trim() === "" || r.stocks.trim() === "")) {
    throw new Error("Enter a price and stock for every row.");
  }

  const variants = rows.map((r) => ({
    label: r.label.trim(),
    price: Number(r.price),
    stocks: Number(r.stocks),
  }));

  if (variants.some((v) => v.price < 0 || !Number.isInteger(v.stocks) || v.stocks < 0)) {
    throw new Error("Price and stock must be valid numbers.");
  }

  if (variants.length > 1) {
    const labels = variants.map((v) => v.label.toLowerCase());
    if (labels.some((l) => !l)) throw new Error("Give every size a name.");
    if (new Set(labels).size !== labels.length) throw new Error("Size names must be different.");
  }

  return variants.map((v) => ({ ...v, label: v.label || undefined }));
};

  const handleSubmit = async (
    item: FormItem,
    file: FormFiles,
    lists: FormLists,
  ) => {
    const payload = {
      img: file.img ?? null,
      name: item.name.trim(),
      description: item.description,
      category: item.category,
      variants: toVariants(lists.variants ?? []),
    };

    !selectedItem ? await api.addRequest(payload) : await api.updateRequest(payload, selectedItem.id );
  };

  return (
    <div className="px-4 md:px-12 pb-12 w-full h-full flex flex-col gap-4">
      {isFormOpen && (
        <Form
          addTitle="Add Menu"
          editTitle={`Edit Menu`}
          selectedItem={selectedItem}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onOutsideClick={() => setIsFormOpen(false)}
          fields={[
            {
              fieldtype: "file",
              name: "img",
              placeholder: "Upload image",
            },
            {
              fieldtype: "input",
              name: "name",
              type: "text",
              placeholder: "Name",
            },
            {
              fieldtype: "input",
              name: "description",
              type: "text",
              placeholder: "Description",
            },
            {
              fieldtype: "select",
              name: "category",
              placeholder: "Categories",
              options: categories,
            },
            {
              fieldtype: "multiple",
              name: "variants",
              title: "Product Variant",
              columns: [
                { name: "label", placeholder: "Size", type: "text" },
                { name: "price", placeholder: "Price", type: "number" },
                { name: "stocks", placeholder: "Stocks", type: "number" },
              ],
            },
          ]}
          onSubmit={handleSubmit}
        />
      )}

      <div className="flex gap-4 items-center">
        <Fields.Input
          icon={LuSearch}
          name="search"
          type="text"
          value={search}
          placeholder="Search menu, or sku number..."
          onChange={searchOnChange}
        />

        <div className="hidden xl:flex w-12 xl:w-40 shrink-0">
          <Button.Solid
            icon={LuPlus}
            type="button"
            name="Add Menu"
            onClick={openForm}
          />
        </div>

        <div className="xl:hidden">
          <Button.Small icon={LuPlus} type="button" onClick={openForm} />
        </div>
      </div>

      {/* Top Section */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          {filter.map((items) => (
            <button
              key={items.name}
              className={`hidden xl:inline border border-gray-300 text-gray-400 py-1 px-4 rounded-xl cursor-pointer
                            ${filterValue === items.value ? "bg-primary text-white border-primary" : ""}
                            `}
              onClick={() => {
                setFilterValue(items.value);
              }}
            >
              {items.name}
            </button>
          ))}

          <div className=" xl:hidden mt-2">
            <Fields.Select
              name="filter"
              value={selectedName}
              optionsArray={filter.map((items) => items.name)}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const match = filter.find((f) => f.name === e.target.value);
                setFilterValue(match?.value ?? "");
              }}
            />
          </div>
        </div>
      </div>

      {/* Card Container */}
      <div className=" lg:overflow-y-auto grid grid-cols-2 lg:grid-cols-1 gap-4 w-full">
        {items.map((item) => (
          <div
            key={item.sku}
            className="lg:flex gap-4 border border-foreground/10 rounded-lg items-center shadow-md/10 w-full"
          >
            <div className="lg:w-56 relative aspect-square shrink-0 overflow-hidden">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 lg:p-0 w-full">
              <div className="flex justify-between font-semibold text-md lg:text-xl">
                <h1>{item.name}</h1>
                <p>₱{item.price}</p>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-xs lg:text-base text-foreground/50 font-semibold">
                  {item.sku}
                </p>
                <p className="xl:w-[75%] text-foreground/50 text-xs xl:text-sm line-clamp-2 lg:line-clamp-3 xl:line-clamp-none">
                  {item.description}
                </p>
              </div>

              <p className="mt-4">
                {item.stocks === 0 ? (
                  <span className="text-primary">Out of Stocks</span>
                ) : (
                  <span className="font-semibold text-xs md:text-base">
                    Stocks: {item.stocks}
                  </span>
                )}
              </p>
            </div>

            <div className="hidden lg:px-8  h-full lg:flex items-center cursor-pointer">
              <item.actions className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inventory;
