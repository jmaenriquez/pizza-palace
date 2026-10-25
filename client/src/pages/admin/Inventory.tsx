import React from "react";

import { Constants } from "../../api/database.types";
import api, {
  type ProductWithVariants,
} from "../../api/requests/productRequest";

import Button from "../../widgets/Button";
import Fields from "../../widgets/Fields";
import Form, {
  type FormItem,
  type FormFiles,
  type FormLists,
} from "../../components/reusable/Form";

import { useHeaderData } from "../../utils/hooks/useHeaderData";
import {
  LuEllipsisVertical,
  LuPencil,
  LuPlus,
  LuSearch,
  LuTrash2,
} from "react-icons/lu";
import toast from "react-hot-toast";
import { FaPizzaSlice } from "react-icons/fa";

interface FilterValues {
  name: string;
  value: string;
}

function Inventory() {
  // ------------------------------------------utilities--------------------------------------
  useHeaderData("Menu");

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
  const [products, setProducts] = React.useState<ProductWithVariants[]>([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<Record<
    string,
    string
  > | null>(null);
  const [selectedList, setSelectedList] = React.useState<FormLists | null>(null)

  const [filterValue, setFilterValue] = React.useState("");
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  // -------------------------------Functions-------------------------------------

  const selectedName =
    filter.find((f) => f.value === filterValue)?.name ?? "All";

  const searchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const openForm = () => {
    setSelectedItem(null);
    setSelectedList(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedList(null);
    setSelectedItem(null);
  };

  const toVariants = (rows: Record<string, string>[]) => {
    if (rows.some((r) => r.price.trim() === "" || r.stocks.trim() === "")) {
      throw new Error("Enter a price and stock for every row.");
    }

    const variants = rows.map((r) => ({
      id: r.id || undefined,
      label: r.label.trim(),
      price: Number(r.price),
      stocks: Number(r.stocks),
    }));

    if (
      variants.some(
        (v) => v.price < 0 || !Number.isInteger(v.stocks) || v.stocks < 0,
      )
    ) {
      throw new Error("Price and stock must be valid numbers.");
    }

    if (variants.length > 1) {
      const labels = variants.map((v) => v.label.toLowerCase());
      if (labels.some((l) => !l)) throw new Error("Give every size a name.");
      if (new Set(labels).size !== labels.length)
        throw new Error("Size names must be different.");
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

    if (!selectedItem) {
      await api.addRequest(payload);
    } else {
      await api.updateRequest(payload, selectedItem.id);
    }

    await fetchData();
  };

  const fetchData = async () => {
    try {
      setProducts(
        await api.getRequest({ category: filterValue, search: search }),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch product records");
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const startEdit = (p: ProductWithVariants) => {
    setSelectedItem({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      category: p.category,
      img: p.image_url,
    });
    setSelectedList({
      variants: p.product_variants
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((variant) => ({ id: variant.id, label: variant.label ?? '', price: String(variant.price), stocks: String(variant.stocks)  }))
    });

    setOpenMenuId(null);
    setIsFormOpen(true);
  };

  const actionMenu = (item: ProductWithVariants) => (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => toggleMenu(e, item.id)}
        aria-label="Product actions"
        className="cursor-pointer"
      >
        <LuEllipsisVertical className="w-6 h-6" />
      </button>

      {openMenuId === item.id && (
        <div
          className="absolute right-0 bottom-full mb-2 lg:bottom-auto lg:top-full lg:mb-0 lg:mt-2
                     w-40 rounded-lg p-2 z-20 bg-foreground/90 backdrop-blur-sm shadow-lg
                     border border-background/10 text-background"
        >
          <button
            type="button"
            onClick={() => startEdit(item)}
            className="flex w-full gap-2 px-3 py-2 rounded-md font-poppins text-sm cursor-pointer
                       hover:bg-background/10 hover:text-secondary transition-colors"
          >
            <LuPencil className="w-4 h-4" /> Edit
          </button>
          <button
            type="button"
            className="flex w-full gap-2 px-3 py-2 rounded-md font-poppins text-sm cursor-pointer
                       hover:bg-background/10 hover:text-secondary transition-colors"
          >
            <LuTrash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );

  // ------------------------------- useEffects --------------------------

  React.useEffect(() => {
    if (!openMenuId) return;
    const close = () => setOpenMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenuId]);

  React.useEffect(() => {
    fetchData().catch((err) => console.error(err));
  }, [filterValue, search]);

  return (
    <div className="px-4 md:px-12 pb-12 w-full h-full flex flex-col gap-4">
      {isFormOpen && (
        <Form
          addTitle="Add Menu"
          editTitle={`Edit Menu`}
          selectedItem={selectedItem}
          selectedList={selectedList}
          isOpen={isFormOpen}
          onClose={closeForm}
          onOutsideClick={closeForm}
          toastMessage={selectedItem ? `Product edited successfully.` : `Product added to menu.` }
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

      {products.length === 0 ? (
        <div className="mt-12 md:mt-0 h-full flex-1 flex flex-col items-center justify-center gap-4 text-gray-300">
          <FaPizzaSlice className="w-12 h-12" />
          <p className="text-sm text-center">
            The Pizzas are still being processed...
          </p>
        </div>
      ) : (
        /* Card Container */
        <div className=" lg:overflow-y-auto grid grid-cols-2 lg:grid-cols-1 gap-4 w-full">
          {products.map((item) => {
            const prices = item.product_variants.map(
              (variant) => variant.price,
            );
            const lowestPrice = Math.min(...prices);
            const highestPrice = Math.max(...prices);
            const totalStocks = item.product_variants.reduce(
              (sum, variant) => sum + variant.stocks,
              0,
            );

            return (
              <div
                key={item.id}
                className="flex flex-col lg:flex-row border border-foreground/10 rounded-lg shadow-md/10"
              >
                {/* image: the rounding lives here now, since the card can't clip the menu */}
                <div className="relative lg:w-50 aspect-square shrink-0 overflow-hidden rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 p-4 flex flex-col gap-3">
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-1 font-semibold text-sm lg:text-xl">
                    <h1>{item.name}</h1>
                    <p className="shrink-0">
                      {lowestPrice === highestPrice
                        ? `₱${lowestPrice}`
                        : `₱${lowestPrice} - ₱${highestPrice}`}
                    </p>
                  </div>

                  <p className="xl:w-[75%] text-foreground/50 text-xs xl:text-sm line-clamp-2 lg:line-clamp-3 xl:line-clamp-none">
                    {item.description}
                  </p>

                  {item.product_variants.some((v) => v.label) && (
                    <div className="md:flex gap-4 md:items-center">
                      <p className="hidden lg:block text-xs md:text-sm">
                        Variants:
                      </p>

                      <div className="flex flex-wrap items-start gap-2">
                        {item.product_variants
                          .filter((v) => v.label)
                          .map((v) => (
                            <p
                              key={v.id}
                              className="w-fit text-xs lg:text-sm px-3 py-1 rounded-full bg-secondary/15"
                            >
                              {v.label}
                            </p>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between">
                    {totalStocks === 0 ? (
                      <span className="text-primary text-xs md:text-base">
                        Out of Stocks
                      </span>
                    ) : (
                      <span className="font-semibold text-xs md:text-base">
                        Stocks: {totalStocks}
                      </span>
                    )}

                    {/* mobile / tablet copy of the menu */}
                    <div className="lg:hidden">{actionMenu(item)}</div>
                  </div>
                </div>

                {/* desktop copy of the menu */}
                <div className="hidden lg:flex items-center px-8">
                  {actionMenu(item)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Inventory;
